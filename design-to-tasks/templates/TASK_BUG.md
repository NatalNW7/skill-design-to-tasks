# [{{id}}] Bug: {{title}}

> Phase 3 individual bug task document. Precondition: TASKS.md approved.
> Language: user's conversation language (e.g., Contexto, Como Reproduzir, Soluções Propostas, Critérios de Aceite).
> Written by the `design-to-tasks` skill. Stored at `docs/tasks/{{id}}-{{slug}}.md`.

- **Phase:** {{MVP | Phase A | Phase B ...}}
- **Status:** {{Todo | Doing | Done}}
- **Type:** Bug
- **Severity / Priority:** {{Low | Medium | High | Critical}}
- **Depends on:** {{task IDs or "—"}}
- **Parallel with:** {{task IDs or "—"}}

---

## 1. Context

- **Observed behavior:** {{What is happening incorrectly}}
- **Expected behavior:** {{What should happen instead}}
- **Impact:** {{Who or what is impacted, and severity of the defect}}

## 2. How to Reproduce

1. {{Step 1 to trigger the issue}}
2. {{Step 2 to trigger the issue}}
3. {{Inputs, payloads, or user actions}}
4. **Observed error:** `{{error message, response code, or stack trace}}`

## 3. Proposed Solutions

{{Detail the identified root cause and the technical strategy to resolve the defect without introducing regressions.}}

### Anticipated Affected Files
- `{{path/to/file}}`

## 4. Acceptance Criteria

- [ ] The defect is no longer reproducible following the reproduction steps.
- [ ] Automated regression test added reproducing the issue and validating the fix.
- [ ] No regression introduced in correlated modules or existing test suites.
