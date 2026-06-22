export const meta = {
  name: 'dar-pipeline',
  description: 'DAR Depth → Drift → Verify → Synthesize over a research vault (optional Claude Code accelerator)',
  phases: [{ title: 'Depth' }, { title: 'Verify' }, { title: 'Synthesize' }],
}

/*
 * Optional deterministic accelerator for steps 3–5 of core/orchestration.md.
 * The portable default is the instruction loop in core/orchestration.md; use this only
 * on Claude Code when you want resumability + budget control.
 *
 * SANDBOX CONSTRAINTS (why the design is shaped this way):
 *  - No filesystem access in the script → the orchestrator reads the role/playbook files
 *    and passes them in `args`; the work-queue lives in script MEMORY; AGENTS do all vault I/O.
 *  - No Date.now()/Math.random() → none used.
 *
 * Invoke from the SKILL after the gate:
 *   args = {
 *     vault:   "/abs/path/to/vault",
 *     mode:    "gtm",
 *     brief:   "<contents of _session.md>",
 *     threads: [{id,desc,priority,serves,sources}],          // gate-ranked ready threads
 *     roles:   { 'deep-diver': "<core/roles/deep-diver.md>", 'skeptic': "...", 'arbiter': "...",
 *                'librarian': "...", 'synthesizer': "...", 'relevance-monitor': "..." },
 *     playbook:"<contents of the chosen core/modes/<mode>.md>"
 *   }
 * On ESCALATE the workflow stops the depth loop and returns {status:'escalate', ...};
 * the orchestrator does the ASK_USER, then re-invokes (resumeFromRunId) with updated threads.
 */

const { vault, mode, brief, roles, playbook } = args
// Token guards — bound the loops so a run can't blow the budget:
const MAX_DEPTH = 4            // max depth iterations
const BATCH = 5               // threads dived per iteration
const VERIFY_CAP = 24         // max claims sent to adversarial verification
const SYNTH_RESERVE = 60_000  // tokens held back for synthesis (enforced only if budget.total is set)

const groupBy = (arr, key) => arr.reduce((m, x) => ((m[x[key]] ||= []).push(x), m), {})
const rank = c => ({ low: 0, medium: 1, high: 2 }[c] ?? 1)
const ctx = (role, task) =>
  `${roles[role]}\n\n---\n## Task\n${task}\n\n## Mode playbook (excerpt)\n${playbook}\n\n## Charter (_session.md)\n${brief}\n\nVault root (write all notes here with absolute paths): ${vault}\nReturn ONLY JSON matching the required schema.`

const DIVE_SCHEMA = {
  type: 'object', additionalProperties: true,
  required: ['threadId', 'claims', 'spawnedThreads', 'dry'],
  properties: {
    threadId: { type: 'string' },
    claims: { type: 'array', items: { type: 'object', additionalProperties: true,
      required: ['id', 'claim', 'confidence', 'source_kind', 'loadBearing', 'serves'],
      properties: {
        id: { type: 'string' }, claim: { type: 'string' },
        confidence: { enum: ['low', 'medium', 'high'] },
        source_kind: { enum: ['primary', 'secondary', 'tertiary'] },
        loadBearing: { type: 'boolean' },
        serves: { type: 'array', items: { type: 'string' } },
        sourcePaths: { type: 'array', items: { type: 'string' } },
      } } },
    spawnedThreads: { type: 'array', items: { type: 'object', additionalProperties: true,
      required: ['id', 'desc', 'priority', 'serves'],
      properties: { id: { type: 'string' }, desc: { type: 'string' },
        priority: { enum: ['P1', 'P2', 'P3'] }, serves: { type: 'string' }, sources: { type: 'number' } } } },
    dry: { type: 'boolean' }, notes: { type: 'string' },
  },
}
const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: true,
  required: ['verdict', 'reasoning'],
  properties: {
    verdict: { enum: ['REFUTED', 'STANDS'] },
    p_false: { type: 'number' },
    disconfirming: { type: ['string', 'null'] },
    scope_correction: { type: ['string', 'null'] },
    reasoning: { type: 'string' },
  },
}
const RELEVANCE_SCHEMA = {
  type: 'object', additionalProperties: true,
  required: ['recommendation', 'drift', 'reasoning'],
  properties: {
    relevanceRatio: { type: 'number' },
    drift: { enum: ['low', 'medium', 'high'] },
    recommendation: { enum: ['CONTINUE', 'REFOCUS', 'ESCALATE', 'CONCLUDE'] },
    threadsToPrune: { type: 'array', items: { type: 'string' } },
    threadsToPromote: { type: 'array', items: { type: 'object', additionalProperties: true } },
    ask_user: { type: ['string', 'null'] },
    reasoning: { type: 'string' },
  },
}

// ---------- PHASE: DEPTH (loop-until-dry over an in-memory backlog) + DRIFT GUARD ----------
phase('Depth')
let backlog = (args.threads || []).map(t => ({ ...t, status: 'ready' }))
const seen = new Set()
const allClaims = []
let iter = 0
let escalation = null
log(`DAR pipeline: mode=${mode}, ${backlog.length} thread(s) queued; MAX_DEPTH=${MAX_DEPTH}, BATCH=${BATCH}, VERIFY_CAP=${VERIFY_CAP}.`)

while (iter < MAX_DEPTH) {
  const ready = backlog.filter(t => t.status === 'ready' && !seen.has(t.id))
  if (!ready.length) { log('Depth backlog dry.'); break }
  if (budget.total && budget.remaining() < SYNTH_RESERVE) { log('Reserving budget for synthesis; ending depth.'); break }

  const batch = ready.slice(0, BATCH)
  batch.forEach(t => seen.add(t.id))
  log(`Depth iteration ${iter + 1}: diving ${batch.length} thread(s).`)

  const dives = (await parallel(batch.map(t => () =>
    agent(ctx('deep-diver', `Go deep on thread ${t.id}: ${t.desc}. FETCH full primaries into ${vault}/raw/, write atomic claim notes into ${vault}/sources/.`),
      { label: `dive:${t.id}`, phase: 'Depth', schema: DIVE_SCHEMA })
  ))).filter(Boolean)

  for (const d of dives) {
    allClaims.push(...(d.claims || []))
    backlog.push(...(d.spawnedThreads || []).map(t => ({ ...t, status: 'ready' })))
  }

  // ----- DRIFT GUARD (step 4.5) -----
  const batchClaims = dives.flatMap(d => d.claims || [])
  const rel = await agent(
    ctx('relevance-monitor', `Score this depth batch against the charter. Batch claims: ${JSON.stringify(batchClaims)}. Current backlog ids: ${JSON.stringify(backlog.filter(t => t.status === 'ready').map(t => t.id))}.`),
    { label: `drift:iter${iter + 1}`, phase: 'Depth', schema: RELEVANCE_SCHEMA })

  if (rel) {
    log(`Drift guard: ${rel.recommendation} (drift=${rel.drift}). ${rel.reasoning}`)
    if (rel.recommendation === 'CONCLUDE') break
    if (rel.recommendation === 'ESCALATE') { escalation = rel; break } // orchestrator handles ASK_USER
    if (rel.recommendation === 'REFOCUS') {
      const prune = new Set(rel.threadsToPrune || [])
      backlog = backlog.map(t => prune.has(t.id) ? { ...t, status: 'dropped' } : t)
      // promotions are recorded by the orchestrator in _session.md; ranking re-derives next iter
    }
  }
  iter++
}

if (escalation) {
  return { status: 'escalate', escalation, claimsSoFar: allClaims.length,
           note: 'Depth paused for human decision; orchestrator should ASK_USER then resume.' }
}

// ---------- PHASE: VERIFY (adversarial refute, 2-of-3 majority) ----------
phase('Verify')
// Token guard: rank by importance, cap how many claims get the 3× skeptic fan-out,
// and drop to 1 skeptic when budget is tight. Skipped claims keep their stated confidence (logged).
const ranked = allClaims
  .filter(c => c.loadBearing || c.confidence !== 'high')
  .sort((a, b) => (Number(b.loadBearing) - Number(a.loadBearing)) || (rank(a.confidence) - rank(b.confidence)))

let tallied = []
const skipVerify = budget.total && budget.remaining() < SYNTH_RESERVE
if (skipVerify) {
  log(`Budget reserved for synthesis — skipping adversarial verify; ${ranked.length} claim(s) kept at their stated confidence (logged, not silently dropped).`)
} else {
  let cap = VERIFY_CAP
  if (budget.total) cap = Math.max(4, Math.min(cap, Math.floor((budget.remaining() - SYNTH_RESERVE) / 9_000)))
  const toVerify = ranked.slice(0, Math.max(0, cap))
  const skeptics = (budget.total && budget.remaining() < SYNTH_RESERVE * 3) ? 1 : 3
  const skipped = ranked.length - toVerify.length
  log(skipped > 0
    ? `Budget guard: verifying top ${toVerify.length} claim(s) × ${skeptics} skeptic(s); ${skipped} lower-priority claim(s) kept at stated confidence (logged, not dropped).`
    : `Verifying ${toVerify.length} claim(s) × ${skeptics} skeptic(s).`)

  const votes = (await parallel(toVerify.flatMap(c =>
    Array.from({ length: skeptics }, (_, i) => () =>
      agent(ctx('skeptic', `Try to REFUTE claim ${c.id}: "${c.claim}". Read its cached raw source(s): ${JSON.stringify(c.sourcePaths || [])}. You are skeptic #${i + 1} of ${skeptics} — vote independently.`),
        { label: `refute:${c.id}#${i + 1}`, phase: 'Verify', schema: VERDICT_SCHEMA })
        .then(v => v && ({ ...v, claimId: c.id })))
  ))).filter(Boolean)

  const byClaim = groupBy(votes, 'claimId')
  tallied = toVerify.map(c => {
    const vs = byClaim[c.id] || []
    const refuted = vs.filter(v => v.verdict === 'REFUTED').length
    const verdict = refuted * 2 > skeptics ? 'DISPUTED' : refuted > 0 ? 'CONTESTED' : 'CONFIRMED'
    return { id: c.id, claim: c.claim, verdict, votes: vs }
  })

  // One writer updates _verify-log.md + note statuses (agents own vault I/O).
  await agent(ctx('arbiter',
    `First, WRITE the verdict tally to ${vault}/_verify-log.md and update each claim note's \`status\` accordingly (CONFIRMED→verified unless already higher; CONTESTED→keep+note dissent; DISPUTED→disputed). Tally: ${JSON.stringify(tallied)}. THEN adjudicate ONLY the CONTESTED/DISPUTED claims per your role (CONFIRM/KILL/OPEN_QUESTION), updating their status and pushing any OPEN_QUESTION leads to ${vault}/_open-threads.md.`),
    { label: 'verify-writer+arbiter', phase: 'Verify' })
}

// ---------- PHASE: SYNTHESIZE ----------
phase('Synthesize')
await agent(ctx('librarian', `Run the structural pass over ${vault}: dedupe notes, resolve [[links]], create missing entity notes, tag, and flag provenance gaps.`),
  { label: 'librarian', phase: 'Synthesize' })
const synth = await agent(ctx('synthesizer', `Synthesize the vault ${vault}: write threads/*.md, _MOC.md, and 99-report.md answering each SC#, and reconcile _open-threads.md into Answered / Still-open / Contradictions.`),
  { label: 'synthesizer', phase: 'Synthesize' })

log(`DAR pipeline complete: ${iter} depth iter(s), ${allClaims.length} claim(s), ${tallied.length} verified, synthesis ${synth ? 'written' : 'unavailable'}.`)
return { status: 'done', vault, depthIterations: iter, claims: allClaims.length, verified: tallied.length, synthesis: synth }
