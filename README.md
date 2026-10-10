# 🎯 design-to-tasks (Agent Skill)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-purple.svg)](https://skills.sh)

Skill profissional para agentes de IA de codificação (**Antigravity**, **Cursor**, **Claude Code**, **Codex**, **Cline**, **Windsurf**, entre outros), projetada para transformar uma ideia inicial em um plano de execução pronto para desenvolvimento por meio de **três fases estritamente controladas por aprovação**.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Como Funciona](#-como-funciona)
- [Passo a Passo: Baixar e Instalar com `npx`](#-passo-a-passo-baixar-e-instalar-com-npx)
  - [Método 1: Agent Skills CLI (Recomendado)](#método-1-agent-skills-cli-recomendado)
  - [Método 2: Instalador CLI Integrado (GitHub direto)](#método-2-instalador-cli-integrado-github-direto)
- [Como Usar a Skill no seu Agente](#-como-usar-a-skill-no-seu-agente)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Desenvolvimento e Testes](#-desenvolvimento-e-testes)
- [Licença](#-licença)

---

## 💡 Visão Geral

A skill `design-to-tasks` estabelece um fluxo rigoroso de refinamento de projetos em 3 documentos armazenados na pasta `docs/` do seu repositório:

1. **`docs/DESIGN.md`** — Problema, contexto, objetivos e decisões de negócio.
2. **`docs/ARCHITECTURE.md`** — Solução técnica com arquitetura C4 (Contexto, Contêineres, Componentes, Implantação) e ADRs.
3. **`docs/TASKS.md`** — Plano de execução com tarefas acionáveis, ordenadas por dependência, estritamente agnóstico a ferramentas de tracking.

### Regras Operacionais Principais

- **Gate Rígido:** A fase $N+1$ fica bloqueada até que o documento da fase $N$ seja redigido, revisado e receba **aprovação explícita** do usuário.
- **Debate Prévio (/grill-me):** Antes de gerar qualquer documento, o agente conduz um questionamento focado e incisivo para desafiar premissas, explorar alternativas e esclarecer ambiguidades.
- **Base Factual:** Nenhuma afirmação ou tecnologia é inventada; todas as decisões são fundamentadas na base de código ou em requisitos validados.
- **Diagramas em Mermaid:** Toda representação visual utiliza blocos padronizados do Mermaid.

---

## 🚀 Passo a Passo: Baixar e Instalar com `npx`

Você pode instalar a skill de duas formas práticas utilizando o `npx`:

### Método 1: Agent Skills CLI (Recomendado)

O [Agent Skills](https://skills.sh) é o padrão aberto de gerenciamento de habilidades para agentes de IA (como Claude Code, Cursor, Antigravity, etc.).

#### 1. Instalar no projeto atual (escopo local):

No terminal, navegue até a raiz do seu projeto e execute:

```bash
npx skills add NatalNW7/skill-design-to-tasks
```

O utilitário detecta os agentes presentes no ambiente e instala a skill na pasta `./.agents/skills/design-to-tasks` (e espelha para agentes configurados).

#### 2. Instalar globalmente (para todos os seus projetos/agentes):

```bash
npx skills add NatalNW7/skill-design-to-tasks -g
```

#### 3. Instalar para agentes específicos:

```bash
npx skills add NatalNW7/skill-design-to-tasks --agent antigravity cursor claude-code
```

#### 4. Listar as skills do repositório antes de instalar:

```bash
npx skills add NatalNW7/skill-design-to-tasks -l
```

---

### Método 2: Instalador CLI Integrado (GitHub direto)

Este repositório conta com um instalador Node.js próprio configurado no `package.json`. Você pode executá-lo diretamente via `npx` apontando para o repositório GitHub, sem precisar clonar nada previamente:

#### 1. Instalação no projeto local:

```bash
npx github:NatalNW7/skill-design-to-tasks
```

Isso copiará automaticamente a pasta da skill e os templates para `./.agents/skills/design-to-tasks`.

#### 2. Instalação em modo global:

```bash
npx github:NatalNW7/skill-design-to-tasks --global
```

Instala diretamente no diretório de skills do usuário (`~/.agents/skills/design-to-tasks`).

#### 3. Instalação em um diretório personalizado:

```bash
npx github:NatalNW7/skill-design-to-tasks --dest ./minhas-skills/design-to-tasks
```

#### 4. Ver opções do comando:

```bash
npx github:NatalNW7/skill-design-to-tasks --help
```

---

## 🛠️ Como Usar a Skill no seu Agente

Assim que a instalação for concluída, a skill já estará disponível para o seu agente de IA.

### No Antigravity (CLI ou IDE)
Inicie uma conversa ou solicite no prompt:
> *"Quero planejar um novo recurso. Ative a skill `design-to-tasks` para refinar a ideia."*

Ou utilize a menção da skill conforme o ambiente. O agente seguirá os 3 passos:
1. Conduzirá o debate da **Fase 1** e aguardará sua aprovação antes de escrever `docs/DESIGN.md`.
2. Conduzirá o debate da **Fase 2** e aguardará sua aprovação antes de escrever `docs/ARCHITECTURE.md`.
3. Conduzirá o debate da **Fase 3** e gerará o `docs/TASKS.md`.

### No Cursor / Claude Code / Windsurf
Como o arquivo `SKILL.md` fica localizado em `./.agents/skills/design-to-tasks/SKILL.md` ou nos diretórios padrão do agente, o assistente reconhecerá as instruções automaticamente quando o contexto ou o prompt mencionar o fluxo `design-to-tasks`.

---

## 📂 Estrutura do Repositório

```text
skill-design-to-tasks/
├── bin/
│   ├── cli.js                  # Ponto de entrada do executável npx
│   └── cli.test.js             # Testes do CLI
├── lib/
│   ├── installer.js            # Lógica de validação e cópia dos arquivos da skill
│   └── installer.test.js       # Testes unitários do instalador
├── design-to-tasks/            # Conteúdo da skill
│   ├── SKILL.md                # Instruções e metadados da skill (Agent Skills Standard)
│   └── templates/              # Templates padronizados em Markdown
│       ├── DESIGN.md           # Template da Fase 1 (Ideia/Design)
│       ├── ARCHITECTURE.md     # Template da Fase 2 (Arquitetura C4 + ADRs)
│       └── TASKS.md            # Template da Fase 3 (Tarefas agnósticas)
├── package.json                # Manifesto npm com comandos bin e scripts
├── LICENSE                     # Licença MIT
└── README.md                   # Documentação do projeto
```

---

## 🧪 Desenvolvimento e Testes

O projeto utiliza o executor de testes nativo do Node.js (`node:test`) com verificação de cobertura sem dependências externas:

```bash
# Executar a suíte de testes e o relatório de cobertura
npm test
```

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Consulte o arquivo para obter mais informações.
