---
name: design-to-tasks
description: Guide a rigid three-phase project refinement (Idea -> Architecture -> Tasks), debating each phase /grill-me style, gating advancement behind explicit approval, and generating docs/DESIGN.md, docs/ARCHITECTURE.md, docs/TASKS.md, and in-repo task files in docs/tasks/.
---

# design-to-tasks

Turn a raw idea into an implementation-ready plan through three strictly gated phases.
Each phase runs a deep, adversarial debate before any document is written, and no phase
starts until the previous phase's document is approved by the user.

## When to use

Use this skill when the user wants to refine a new idea, feature, or project end-to-end
into planning documents, or explicitly asks for `design-to-tasks`. It produces the
following Markdown documents in the target project's `docs/` folder:

1. `docs/DESIGN.md` — the idea, problem, and business-level decisions.
2. `docs/ARCHITECTURE.md` — the technical solution (C4 + ADRs).
3. `docs/TASKS.md` — the execution orchestration plan (status tracking, concurrency waves, and dependency graph).
4. `docs/tasks/<ID>-<slug>.md` — individual actionable task specifications versioned directly in the repository (ideal for solo developers or teams without an external issue tracker).

## Language rule

- Conduct the skill's own reasoning, prompts, and this workflow in **English**.
- Write the **generated documents in the user's current conversation language**.

## Templates

Fill the templates in this skill's `templates/` folder, do not invent structure ad hoc:

- `templates/DESIGN.md` — Phase 1 (Idea & Business Design)
- `templates/ARCHITECTURE.md` — Phase 2 (Technical Architecture & ADRs)
- `templates/TASKS.md` — Phase 3 (Master Execution Plan & Status Orchestrator)
- `templates/TASK.md` — Phase 3 (Individual Feature / Chore Task Document)
- `templates/TASK_BUG.md` — Phase 3 (Individual Bug Task Document)

Copy the relevant template, replace every `{{placeholder}}` and `TODO`, remove sections
that genuinely do not apply, and write the result to the project's `docs/` folder
(create `docs/` and `docs/tasks/` if they do not exist).

## Operating rules (apply to all phases)

- **Rigid gate.** Phase N+1 is blocked until Phase N's document is drafted, reviewed, and
  **explicitly approved** by the user. Never skip a phase. Never draft two phases at once.
- **Debate before drafting.** Before writing any document, run a `/grill-me`-style
  interrogation (see the `/grill-me` workflow): interview the user relentlessly, resolve
  every branch of the decision tree, surface trade-offs, and challenge weak assumptions.
  Only draft the document once the tree is resolved.
- **Ground every claim.** Read the codebase, inputs, and prior docs before asserting
  anything. Flag assumptions explicitly. Never invent facts, APIs, or constraints.
- **Consistency.** Earlier documents are the source of truth. Later phases must not
  contradict earlier ones; if new information invalidates a decision, go back, update the
  earlier doc, and re-confirm before proceeding.
- **Diagrams.** All diagrams are **Mermaid**.

## Phase 1 — Idea -> `docs/DESIGN.md`

1. **Debate (grill-me).** Interrogate until these are resolved:
   - Problem and context; who is affected and why it matters now.
   - Goals and explicit non-goals.
   - Glossary of domain terms.
   - Findings/evidence backing the framing.
   - Key business-level decisions and the alternatives considered.
   - MVP scope vs. later phases.
   - Risks and success metrics.
2. **Gate.** Present a concise summary of the resolved decisions and ask for explicit
   approval to write the document.
3. **Write.** Fill `templates/DESIGN.md` and write `docs/DESIGN.md`.
4. **Stop.** Do not start Phase 2 until the user approves `docs/DESIGN.md`.

## Phase 2 — Architecture -> `docs/ARCHITECTURE.md`

Precondition: `docs/DESIGN.md` approved.

1. **Debate (grill-me).** Interrogate until these are resolved:
   - C4 levels (Context, Containers, Components) and system boundaries.
   - Technology choices and their justification.
   - ADRs: Context -> Decision -> Consequences -> Impact on MVP.
   - Deployment topology, environments, and secrets handling.
   - Cross-cutting concerns: observability, resilience, security.
2. **Gate.** Summarize and request explicit approval.
3. **Write.** Fill `templates/ARCHITECTURE.md` (Mermaid diagrams) and write
   `docs/ARCHITECTURE.md`.
4. **Stop.** Do not start Phase 3 until the user approves `docs/ARCHITECTURE.md`.

## Phase 3 — Tasks -> `docs/TASKS.md` & `docs/tasks/`

Precondition: `docs/ARCHITECTURE.md` approved.

1. **Debate (grill-me).** Interrogate until these are resolved:
   - Slicing into MVP + Phases (A/B/C...).
   - Task breakdown, identifying type for each task (`Feature`, `Bug`, `Chore`, `Refactor`).
   - Dependencies, sequencing, and concurrency: group independent tasks into parallel execution **waves** (Wave 1, Wave 2...).
   - In-repo task versioning confirmation: confirm that individual task files will be maintained in `docs/tasks/<ID>-<slug>.md` so that the repo remains self-contained without needing Jira/Linear.
   - Per-task risk and acceptance criteria.
2. **Gate.** Summarize the execution plan, task list, parallel waves, and request explicit approval.
3. **Write.**
   - Ensure directory `docs/tasks/` exists.
   - For each task, generate `docs/tasks/<ID>-<slug>.md`:
     - Use `templates/TASK.md` for standard features/chores (Context, Proposed Solutions, Acceptance Criteria).
     - Use `templates/TASK_BUG.md` for bugs (Context, How to Reproduce, Proposed Solutions, Acceptance Criteria).
     - Naming convention: `<ID>-<slug>.md` (e.g. `T1-setup-database.md`, `T2-fix-auth-redirect.md`).
   - Fill `templates/TASKS.md` and write `docs/TASKS.md`:
     - Include the execution waves, parallel groupings, and dependency graph.
     - Link every task in the tables directly to its individual document `docs/tasks/<ID>-<slug>.md`.
     - Track lifecycle status: `Todo` -> `Doing` -> `Done`.

### Tool-agnostic requirement (critical)

The core of `docs/TASKS.md` and `docs/tasks/*.md` MUST stay tool-agnostic:

- No proprietary tool names, external tracker keys, or custom board fields in the core sections.
- Use local, stable task IDs (`T1`, `A1`, `B2`, ...).
- Keep every tracker bridge inside the clearly-labeled optional export appendix at the end
  of `templates/TASKS.md`. A separate tool-specific skill (e.g. a Jira skill) may later materialize
  those tasks; do not couple the repository documents to external services.

## Completion & handoff

Recap the generated documents (`docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`, and all `docs/tasks/*.md`).
Explain how developers or coding agents (e.g. via the `software-engineer` skill) should execute the plan:
1. Inspect `docs/TASKS.md` to identify the next eligible task in the current wave whose dependencies are `Done`.
2. Update the task status to `Doing` in `docs/TASKS.md` (and inside its task file).
3. Read `docs/tasks/<ID>-<slug>.md` for context, proposed solutions, and acceptance criteria.
4. Implement the task following TDD and project engineering standards.
5. Mark the task status as `Done` once acceptance criteria and test coverage are met.
