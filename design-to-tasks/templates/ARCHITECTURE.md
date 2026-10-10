# {{project_name}} — Architecture

> Phase 2 document. Precondition: DESIGN.md approved. Language: user's conversation language.
> Diagrams: Mermaid. Written by the `design-to-tasks` skill.

## How to read this document

This follows the C4 model: Level 1 (Context), Level 2 (Containers), Level 3 (Components),
plus a Dynamic View and a Deployment view. Architectural Decision Records (ADRs) capture
the reasoning behind each significant choice.

## Level 1 — System context

```mermaid
graph TD
    user["{{actor}}"] --> sys["{{system_name}}"]
    sys --> ext["{{external_system}}"]
```

- **System responsibility:** {{what the system does}}
- **Actors:** {{who uses it}}
- **External systems:** {{integrations}}

## Level 2 — Containers

```mermaid
graph TD
    subgraph "{{system_name}}"
        c1["{{container: e.g. API service}}"]
        c2["{{container: e.g. data store}}"]
    end
    c1 --> c2
```

- {{container}} — {{responsibility / tech}}

## Level 3 — Components

```mermaid
graph TD
    comp1["{{component}}"] --> comp2["{{component}}"]
```

- {{component}} — {{responsibility}}

## Dynamic view

Key flow(s) end to end.

```mermaid
sequenceDiagram
    participant A as {{actor/component}}
    participant B as {{component}}
    A->>B: {{step}}
    B-->>A: {{result}}
```

## Level 4 — Deployment

```mermaid
graph TD
    subgraph "{{environment}}"
        node["{{runtime/node}}"]
    end
```

- **Environments:** {{dev/cert/prod}}
- **Runtime:** {{platform}}
- **Secrets:** {{how secrets are provided}}

## Cross-cutting concerns

- **Observability:** {{logs/metrics/traces}}
- **Resilience:** {{retries, circuit breakers, fallbacks}}
- **Security:** {{authn/authz, data protection}}

## Architectural Decision Records (ADRs)

### D1 — {{decision title}}
- **Context:** {{forces at play}}
- **Decision:** {{what was decided}}
- **Consequences:** {{trade-offs, positive and negative}}
- **Impact on MVP:** {{in / out / partial}}

## Open gaps

- {{unresolved architectural question}}
