# ADR-013: Claude-flow Swarm Intelligence & Best Practices

**Status:** Approved  
**Date:** 2026-02-09  
**Context:** Code generation using AI swarm intelligence  
**Decision Makers:** Technical Leadership

---

## Context

The Healthcare Orchestration Platform requires generating 500,000+ lines of production code (BPMN processes, Python workers, DMN tables, infrastructure, tests) based on a comprehensive technical specification and 12 architectural decision records. Traditional incremental development would take 8-12 months. We need an accelerated, intelligent approach leveraging AI swarm coordination with claude-flow CLI tools.

This ADR establishes **mandatory best practices** for all code generation tasks using claude-flow and related tools (RuVector, flow-nexus, hive-mind).

---

## Decision

We will use **claude-flow swarm intelligence** as the primary code generation methodology, following these binding principles:

### 1. Memory-First Architecture (No Temporary Markdown Files)

**RULE:** Use claude-flow memory system for all temporary state, progress tracking, and learned patterns. **DO NOT** create markdown files like `PROGRESS.md`, `STATUS.md`, `TODO.md` for tracking work.

**Rationale:**
- Markdown files consume repository space and create noise
- Memory system is semantic-searchable with RuVector HNSW
- Memory entries can be versioned and namespaced
- Automatic cleanup of obsolete state

**Implementation:**
```bash
# Store progress
npx @claude-flow/cli@latest memory store \
  --key "progress-[phase]" \
  --value "[description]" \
  --namespace healthcare-platform

# Store patterns learned
npx @claude-flow/cli@latest memory store \
  --key "pattern-[name]" \
  --value "[what worked]" \
  --namespace patterns

# Search prior work
npx @claude-flow/cli@latest memory search \
  --query "[topic]" \
  --namespace healthcare-platform
```

### 2. Intelligent Model Routing (Cost Efficiency)

**RULE:** Use claude-flow's built-in model routing to automatically select optimal model per task complexity.

**Rationale:**
- Simple tasks (file copying, formatting) → smaller models
- Complex tasks (architecture design, business logic) → advanced models
- Reduces API costs by 40-60%
- Maintains quality where needed

**Implementation:**
```bash
# Automatic routing based on task complexity
npx @claude-flow/cli@latest hive-mind spawn \
  --workers 10 \
  --claude \
  --model-routing intelligent \
  --objective "[task]"

# Models available: claude-3-7-sonnet, claude-3-5-sonnet, claude-3-haiku
# Routing algorithm: Task complexity analysis → model assignment
```

### 3. Lifecycle Hooks (Task Tracking)

**RULE:** Use pre-task and post-task hooks for all significant operations.

**Implementation:**
```bash
# Before any major task
npx @claude-flow/cli@latest hooks pre-task \
  --description "[task description]" \
  --task-id "[unique-id]" \
  --namespace healthcare-platform

# After success
npx @claude-flow/cli@latest hooks post-task \
  --task-id "[unique-id]" \
  --status success \
  --output "[results summary]"

# After failure
npx @claude-flow/cli@latest hooks post-task \
  --task-id "[unique-id]" \
  --status failure \
  --error "[error details]"
```

### 4. Neural Learning (Pattern Extraction)

**RULE:** Train neural models on generated code to continuously improve pattern recognition.

**Implementation:**
```bash
# After generating workers/BPMN/DMN
npx @claude-flow/cli@latest neural train \
  --modelType moe \
  --data-source "platform/workers/[domain]" \
  --epochs 10 \
  --namespace healthcare-platform

# For classification tasks (routing, prioritization)
npx @claude-flow/cli@latest neural train \
  --modelType classifier \
  --training-data .claude-flow/training-data.jsonl \
  --epochs 15

# For complex pattern synthesis
npx @claude-flow/cli@latest neural train \
  --modelType transformer \
  --data-source "platform/" \
  --epochs 20
```

### 5. Hive-Mind Swarm Coordination

**RULE:** Use hierarchical-mesh topology with Byzantine consensus for all parallel code generation.

**Rationale:**
- Hierarchical: Coordinator agents manage specialist agents
- Mesh: Specialists can communicate peer-to-peer
- Byzantine consensus: Fault-tolerant decision making (tolerates up to 33% malicious/failed agents)

**Topology Comparison:**

| Topology | Best For | Max Agents | Fault Tolerance |
|---|---|---|---|
| `hierarchical` | Simple tasks, clear decomposition | 50 | Low |
| `mesh` | Collaborative tasks, peer review | 20 | Medium |
| `hierarchical-mesh` | Complex multi-domain projects | 100+ | High (Byzantine) |

**Implementation:**
```bash
# Initialize swarm
npx @claude-flow/cli@latest hive-mind init \
  --topology hierarchical-mesh \
  --max-agents 15 \
  --consensus byzantine

# Spawn coordinated swarm
npx @claude-flow/cli@latest hive-mind spawn \
  --workers 10 \
  --role specialist \
  --topology hierarchical-mesh \
  --consensus byzantine \
  --claude \
  --objective "[detailed objective]"
```

### 6. RuVector Semantic Search (Knowledge Base)

**RULE:** Store all technical specifications, ADRs, templates in RuVector for semantic retrieval.

**Implementation:**
```bash
# Index documentation
npx @claude-flow/cli@latest vector index \
  --source "docs/" \
  --namespace healthcare-platform \
  --algorithm hnsw \
  --dimensions 768

# Semantic search during generation
npx @claude-flow/cli@latest vector search \
  --query "multi-tenant worker authentication pattern" \
  --namespace healthcare-platform \
  --top-k 5
```

### 7. Comprehensive Tool Usage

**MANDATORY:** Use ALL available claude-flow capabilities, not just basic commands.

**Tool Checklist:**

- [x] `memory` — Store/search context, patterns, progress
- [x] `neural` — Train models on generated code
- [x] `vector` — Semantic search across documentation
- [x] `hive-mind` — Swarm coordination
- [x] `hooks` — Lifecycle tracking
- [x] `patterns` — Pattern library management
- [x] `learn` — Extract patterns from existing code
- [x] `validate` — Quality checks on generated code
- [x] `analyze` — Gap analysis vs. requirements

---

## Consequences

### Positive

- **40-60% cost reduction** via intelligent model routing
- **No repository clutter** from temporary status files
- **Continuous learning** from generated code patterns
- **Fault-tolerant** parallel execution (Byzantine consensus)
- **Semantic knowledge retrieval** (RuVector HNSW)
- **Reproducible** code generation (hooks track all tasks)
- **Scalable** to 100+ parallel agents

### Negative

- **Learning curve** for team (2-3 days training on claude-flow CLI)
- **Dependency** on claude-flow ecosystem (mitigation: open source, Apache 2.0)
- **Complexity** in debugging swarm failures (mitigation: comprehensive logging, dead-letter queues)

---

## Example: Revenue Cycle Worker Generation

### ❌ OLD APPROACH (Avoid)

```bash
# Manually generate workers one by one
# Create progress.md to track status
# No pattern learning
# No cost optimization
# Serial execution only
```

### ✅ NEW APPROACH (Required)

```bash
# 1. Initialize swarm
npx @claude-flow/cli@latest hive-mind init \
  --topology hierarchical-mesh \
  --max-agents 15 \
  --consensus byzantine

# 2. Pre-task hook
npx @claude-flow/cli@latest hooks pre-task \
  --description "Generate revenue cycle workers (89 total)" \
  --task-id "rc-workers-001" \
  --namespace healthcare-platform

# 3. Spawn swarm with intelligent routing
npx @claude-flow/cli@latest hive-mind spawn \
  --workers 10 \
  --role specialist \
  --topology hierarchical-mesh \
  --consensus byzantine \
  --claude \
  --model-routing intelligent \
  --objective "
    Generate 89 revenue cycle Python workers following:
    - Technical spec: docs/Technical specification/technical-specification.md
    - Template: docs/Technical specification/CIB7_WORKER_TEMPLATE.md
    - ADRs: 003 (Python workers), 002 (multi-tenant), 008 (OAuth2)
    - Output: platform/workers/revenue_cycle/
    
    Use memory namespace 'healthcare-platform' for context.
    Store learned patterns in namespace 'patterns'.
    No temporary markdown files.
  "

# 4. Train neural model on generated code
npx @claude-flow/cli@latest neural train \
  --modelType moe \
  --data-source "platform/workers/revenue_cycle/" \
  --epochs 10 \
  --namespace healthcare-platform

# 5. Post-task hook
npx @claude-flow/cli@latest hooks post-task \
  --task-id "rc-workers-001" \
  --status success \
  --output "Generated 89 workers, 25 patterns extracted, 87% test coverage"

# 6. Store patterns for future use
npx @claude-flow/cli@latest memory store \
  --key "pattern-rc-workers" \
  --value "Multi-tenant worker with OAuth2, BPMN error handling, idempotency" \
  --namespace patterns
```

---

## Swarm Spawn Best Practices (CRITICAL)

**ESTABLISHED WORKFLOW (Proven Pattern - 2026-02-09):**

### Agent-User Collaboration Protocol

**AGENT RESPONSIBILITIES:**
1. Execute pre-task hooks (`npx @claude-flow/cli@latest hooks pre-task`)
2. Store task context in memory system (not markdown files)
3. Prepare swarm spawn command with complete objective
4. **Display command in code block for manual copy-paste**
5. Wait for user notification of completion (no active monitoring)
6. Execute post-task hooks and neural training
7. Store completion status in memory

**USER RESPONSIBILITIES:**
1. Copy swarm command from agent's code block
2. Paste into separate terminal window
3. Monitor swarm execution progress
4. Notify agent when swarm completes

### ✅ CORRECT: Display Command for Manual Copy-Paste

```markdown
Agent provides in dialog:

\`\`\`bash
npx @claude-flow/cli@latest hive-mind spawn \
  --workers 4 \
  --topology hierarchical-mesh \
  --consensus byzantine \
  --claude \
  --model-routing intelligent \
  --namespace healthcare-platform \
  --use-memory \
  --use-patterns \
  --use-vectors \
  --use-learning \
  --objective "
[Complete detailed objective here...]
"
\`\`\`

**Copy the entire command above and paste it into your other terminal window.**
```

**WHY THIS WORKS:**
- ✅ User has full visibility and control
- ✅ No terminal automation conflicts (heredoc, pipes, escaping)
- ✅ User can review command before execution
- ✅ Separate terminal preserves swarm output
- ✅ No interruption of agent-user dialog
- ✅ User determines execution timing

### ❌ INCORRECT: Automated Execution Attempts

**DO NOT USE:**
```bash
# ❌ run_in_terminal with swarm spawn (blocks dialog)
npx @claude-flow/cli@latest hive-mind spawn ... 

# ❌ Heredoc to file then cat (extra steps, no benefit)
cat << 'EOF' > /tmp/command.txt
npx @claude-flow/cli@latest hive-mind spawn ...
EOF
cat /tmp/command.txt

# ❌ Background execution in agent terminal
npx @claude-flow/cli@latest hive-mind spawn ... &
```

**WHY THESE FAIL:**
- Terminal conflicts with user's active shell
- Escaping issues with complex objectives
- Lost swarm output visibility
- Blocks agent-user dialog during execution
- No user control over timing

### ❌ ANTI-PATTERN: "Agent Introspection Loop" (NEW — 2026-02-19)

**Definition**: Swarm workers executing tool introspection commands (e.g. `hooks statusline`, `memory list`, `hive-mind status`) in place of actual work — reading/writing files, running grep/find, storing memory keys. The agent *appears busy* but produces no deliverables.

**Observed Failure (AUSTA analysis session 2026-02-19):**
```
# ❌ Workers repeatedly ran:
npx @claude-flow/cli@latest hooks statusline
# → Returned agent state, NOT file contents
# → Memory keys dim1-purpose-summary, dim2-plan-quality-scores NEVER stored
# → Worker-8 (Synthesizer) never received upstream data → REPOSITORY_DEEP_ANALYSIS.md NOT written
```

**Symptoms:**
- Worker appears to "complete" but expected memory keys are missing
- `memory list --namespace X` shows only scope keys, not data keys
- Final synthesizer worker writes 0 or 1 of N expected reports
- Agents loop on statusline/status commands without actual file reads

**Root Cause:** Swarm objective lacked per-worker exit gates. Workers had no explicit instruction to verify their own memory key was stored before declaring completion.

**Prevention — Mandatory Per-Worker Exit Gate:**

Every worker in the objective MUST end with an explicit self-verification step:
```
Worker-N (ROLE-NAME):
  READ: [exact file paths]
  EXECUTE: [exact grep/find/wc commands]
  STORE: memory key <key-name>, namespace <ns>
  EXIT GATE ✅: npx @claude-flow/cli@latest memory retrieve -k <key-name> --namespace <ns> | wc -c
              → must be > 500 (confirms key was written, not empty)
              → IF GATE FAILS: re-execute READ+STORE steps before proceeding
```

**Why `hooks statusline` is NOT work:**
- `hooks statusline` returns the agent's own runtime state — it is a diagnostic tool
- Workers must use `read_file`, `grep_search`, `run_in_terminal` (find/grep/wc) for actual analysis
- Every worker must produce at least 1 memory key with substantive content (>500 bytes)

**✅ CORRECT per-worker pattern:**
```
Worker-1 (RECON-LEAD):
  1. READ docs/specifications/FUNCTIONAL_REQUIREMENTS.md
  2. READ docs/original documentation/Technical Specifications_*.md
  3. EXTRACT: purpose statement, user personas, regulatory context
  4. STORE: npx @claude-flow/cli@latest memory store -k dim1-purpose-summary --namespace austa-analysis --value "<extracted content>"
  5. SELF-VERIFY: npx @claude-flow/cli@latest memory retrieve -k dim1-purpose-summary --namespace austa-analysis
     → MUST return content > 500 chars, else REPEAT steps 1-4
```

---

### ❌ ANTI-PATTERN: "Missing Upstream Gate in Synthesizer" (NEW — 2026-02-19)

**Definition**: The synthesizer/report-writer worker starts writing output without first verifying all upstream memory keys exist and have substantive content.

**Observed Failure:**
```
# ❌ Worker-8 ran without checking upstream keys
# dim1-purpose-summary   → NOT STORED (Worker-1 never confirmed)
# dim2-plan-quality-scores → NOT STORED (Worker-2 never confirmed)
# dim3-adherence-gaps    → NOT STORED (Worker-3 never ran)
# Result: REPOSITORY_DEEP_ANALYSIS.md → NOT WRITTEN
```

**Prevention — Mandatory Synthesizer Pre-Check:**
```
Worker-8 (REPORT-SYNTHESIZER) MUST execute this check FIRST:
  REQUIRED_KEYS = [dim1-purpose-summary, dim2-plan-quality-scores,
                   dim3-adherence-gaps, dim4-backend-scored, dim4-frontend-scored,
                   dim5-security-checklist, dim5-deps-audit]
  
  FOR EACH key IN REQUIRED_KEYS:
    result = npx @claude-flow/cli@latest memory retrieve -k <key> --namespace <ns>
    IF result is empty or < 200 bytes:
      ABORT and store error: "SYNTHESIZER-BLOCKED: missing key <key>"
      DO NOT write any report — incomplete data produces misleading output
  
  ONLY IF ALL keys pass: proceed to write reports
```

**Why this matters:** A synthesizer writing from incomplete data produces a hallucinated report. It is better to fail loudly (abort + store error key) than silently produce a partial report.

---

### ❌ ANTI-PATTERN: "Batch Anti-Pattern — Single Swarm for Sequential Dimensions" (NEW — 2026-02-19)

**Definition**: Launching a single monolithic swarm for tasks that have explicit dependency ordering (Dimension X depends on Dimension Y) instead of parallel swarms for independent dimensions + a final sequential synthesis swarm.

**Observed Failure:**
```
# ❌ Single 8-worker swarm for all 5 dimensions
# Workers 3-7 started in parallel but Worker-3 (TRACE) needed DIM-1 and DIM-2 output
# DIM-1 and DIM-2 weren't stored yet when Worker-3 ran → Worker-3 produced empty findings
```

**Correct Pattern — Parallel Swarms for Independent Dims:**
```
SWARM-A (independent): DIM-1 + DIM-2  → stores dim1-purpose-summary, dim2-plan-quality-scores
SWARM-B (independent): DIM-4 backend + frontend → stores dim4-backend-scored, dim4-frontend-scored
SWARM-C (independent): DIM-5 security + deps    → stores dim5-security-checklist, dim5-deps-audit

[GATE: wait for A+B+C memory keys to all exist with >500 bytes each]

SWARM-D (depends on A+B+C): DIM-3 adherence + final synthesis → writes 3 reports
```

**Rule:** If Dimension X explicitly lists `depends_on: [DIM-Y]`, it MUST be in a separate later swarm. Independent dimensions CAN share a swarm if they have no dependencies.

---

### ❌ ANTI-PATTERN: "Queen-as-Coder"

**Definition**: Agent acting as primary code generator instead of delegating to swarm intelligence.

**Symptoms:**
```markdown
# ❌ Agent writes code directly using replace_string_in_file
Agent: "I'll update the worker file now..."
[Agent proceeds to edit 50+ files manually using tools]

# ❌ Agent generates code in chat then asks user to copy-paste
Agent: "Here's the new worker code:"
```python
class NewWorker(BaseExternalTaskWorker):
    # 200 lines of code...
```
"Copy this into the file..."

# ❌ Agent performs repetitive manual tasks
Agent: "I'll create each of the 48 collection workers one by one..."
[Proceeds to create files sequentially over hours]
```

**WHY THIS IS WRONG:**
- **Violates user's role**: User stated "senior software architect and planner... not a developer"
- **Inefficient**: Manual file edits take 10-20x longer than swarm parallelization
- **Error-prone**: Manual edits introduce inconsistencies, typos, missed files
- **No learning**: Patterns not captured in neural system for future reuse
- **No scalability**: Cannot handle 100+ file operations
- **Context limit**: Agent runs out of tokens after 20-30 manual edits
- **User frustration**: User explicitly said "DELEGATE, DO NOT CODE"

**✅ CORRECT APPROACH:**
```markdown
Agent: "I'll prepare Swarm J to handle this. It will create 120 DMN tables and modify 83 workers."

[Agent executes pre-task hook]
[Agent stores scope in memory]
[Agent displays spawn command for user to copy-paste]

Agent: "Copy the command above to your separate terminal. The swarm will parallelize across 8 workers and complete in 16-20 hours."
```

**USER'S STATED WORKING STYLE (from conversation):**
> "use claude-flow memory and all claude-flow tools, always parallelize everything possible, always follows ADR-013 and handoff.yaml"
> "stop doing manual work, you are architect, planner, not coder"
> "CONFIRM COMMANDS AND SUGGEST OPTIONS TO PROCEED"

**WHEN MANUAL EDITING IS ACCEPTABLE:**
- Single file fixes (1-2 files, <50 lines total)
- Configuration changes (package.json, pyproject.toml)
- Emergency hotfixes requiring immediate resolution
- Prototyping/proof-of-concept before swarm execution
- **ALWAYS ASK FIRST**: "Should I fix this manually or prepare a swarm?"

**DELEGATION THRESHOLD:**
- **1-2 files**: Agent can edit manually (with permission)
- **3-10 files**: Suggest swarm, offer manual as fallback
- **11+ files**: MANDATORY swarm delegation
- **Pattern replication**: ALWAYS use swarm (even if only 2 files, if pattern repeats)

**AGENT ROLE DEFINITION:**
- **Architect**: Design solutions, define scope, plan execution
- **Planner**: Break down tasks, estimate effort, sequence dependencies
- **Coordinator**: Prepare swarm commands, execute hooks, validate results
- **NOT Coder**: Do not write production code manually (swarms do this)

### Command Format Requirements

**COMPLETE COMMAND STRUCTURE:**
```bash
npx @claude-flow/cli@latest hive-mind spawn \
  --workers <N> \                          # Worker count based on task
  --topology hierarchical-mesh \           # Best for complex tasks
  --consensus byzantine \                  # Fault-tolerant voting
  --claude \                               # Use Claude models
  --model-routing intelligent \            # Cost optimization
  --namespace healthcare-platform \        # Project namespace
  --use-memory \                           # Memory system access
  --use-patterns \                         # Pattern library access
  --use-vectors \                          # Semantic search
  --use-learning \                         # Neural learning
  --objective "
[DETAILED OBJECTIVE WITH:]
- **CONTEXT:** What we're building and why
- **MEMORY CONTEXT:** Keys to retrieve (phase context, patterns)
- **WORKER ROLES:** Specific assignments per agent
- **DELIVERABLES:** Exact files/artifacts to create
- **SUCCESS CRITERIA:** Validation checkpoints
- **VALIDATION COMMANDS:** How to verify completion
- **ESTIMATED TIME:** Expected duration
"
```

**OBJECTIVE SIZE:** Typically 3-10KB for comprehensive tasks. Include all context agents need.

### Phase Workflow Pattern

**Standard Phase Execution:**
```
1. Agent: Execute pre-task hook
   → npx @claude-flow/cli@latest hooks pre-task --task-id "phase-X"

2. Agent: Store phase scope in memory
   → npx @claude-flow/cli@latest memory store --key "phase-X-scope"

3. Agent: Display swarm command in code block (manual copy-paste)
   → User copies and pastes into separate terminal

4. User: Executes swarm in separate terminal
   → Monitor progress, wait for completion

5. User: Notifies agent "Phase X complete" or similar
   → Agent proceeds to post-task routine

6. Agent: Verify deliverables
   → find, wc, grep commands to validate output

7. Agent: Execute post-task hook
   → npx @claude-flow/cli@latest hooks post-task --task-id "phase-X" --success

8. Agent: Neural training on generated code
   → npx @claude-flow/cli@latest neural train --data-source "..."

9. Agent: Store completion status in memory
   → npx @claude-flow/cli@latest memory store --key "phase-X-complete"

10. Agent: Prepare next phase swarm command
    → Repeat cycle
```

---

## Compliance Verification

Before any code generation sprint:

```bash
# Verify claude-flow version
npx @claude-flow/cli@latest --version
# Required: >= 3.1.0

# Verify RuVector availability
npx @claude-flow/cli@latest vector status

# Verify memory namespace
npx @claude-flow/cli@latest memory list --namespace healthcare-platform

# Verify neural models trained
npx @claude-flow/cli@latest neural list

# Verify hive-mind daemon
npx @claude-flow/cli@latest hive-mind status
```

---

## Session Bootstrap Protocol (Added 2026-02-14)

**RULE:** Every new session MUST execute this initialization sequence before any swarm or task work. These commands are NOT covered in the original ADR sections above and were discovered through production usage.

### Phase A — System Initialization (Required)

```bash
# 1. Ensure fresh CLI version (purge npx cache)
rm -rf ~/.npm/_npx/* && npx -y @claude-flow/cli@latest --version

# 2. Config init (skip if .claude-flow/config.yaml exists)
claude-flow config init

# 3. Start daemon
claude-flow daemon start

# 4. Register MCP servers (one-time; skip if already registered)
claude mcp add claude-flow npx @claude-flow/cli@v3alpha mcp start

# 5. System diagnostic
npx @claude-flow/cli@latest doctor --verbose

# 6. Initialize/reset memory database (CRITICAL after version upgrades)
npx @claude-flow/cli@latest memory init --force --verbose

# 7. Pre-train hook intelligence (scans repo, extracts patterns)
npx @claude-flow/cli@latest hooks pretrain --verbose

# 8. Build agent configs from agents/*.yaml
npx @claude-flow/cli@latest hooks build-agents --verbose
```

### Phase B — Activate Daemon Workers

```bash
# Codebase mapping and architecture analysis
npx @claude-flow/cli@latest hooks worker dispatch --trigger map

# Deep code analysis and examination
npx @claude-flow/cli@latest hooks worker dispatch --trigger deepdive

# Deep knowledge acquisition and learning
npx @claude-flow/cli@latest hooks worker dispatch --trigger ultralearn
```

### Phase C — Neural Training & Verification

```bash
# Train all 3 model types (MOE, transformer, classifier)
npx @claude-flow/cli@latest neural train --modelType moe --epochs 10
npx @claude-flow/cli@latest neural train --modelType transformer --epochs 10
npx @claude-flow/cli@latest neural train --modelType classifier --epochs 10

# Verify
npx @claude-flow/cli@latest neural status
npx @claude-flow/cli@latest hooks intelligence stats
npx @claude-flow/cli@latest memory search --query "test query"
```

### Phase D — Initialize Hive-Mind (Before Swarms)

```bash
npx @claude-flow/cli@latest hive-mind init \
  --topology hierarchical-mesh \
  --max-agents 15 \
  --consensus byzantine
```

### Known Issue: RuVector Native Modules & npx Isolation

**Problem:** `neural status` reports `RuVector WASM: Not loaded`, `SONA Engine: Not loaded`, `HNSW Index: Not loaded` even after training.

**Root Cause:** `npx` runs CLI from its own cache (`~/.npm/_npx/...`), which cannot resolve `@ruvector/core`, `@ruvector/attention-darwin-arm64`, etc. from the project's `node_modules/`. The native modules are installed in the project but invisible to the npx-executed CLI.

**Impact:** Low. The WASM fallback activates automatically and provides full functionality:

- MicroLoRA (256-dim, <1μs adaptation)
- ScopedLoRA (17 operators)
- TrajectoryBuffer, FlashAttention, AdamW Optimizer
- InfoNCE Loss, SONA (256-dim, rank-4, 624k learn/s)
- Embedding Model: all-MiniLM-L6-v2 (384-dim ONNX)

**Mitigation:** The WASM path is the stable default. Native modules provide ~2-3x speedup for large-scale training but are not required for normal swarm operations.

### Known Issue: package.json Must Have `name` and `version`

The project's `package.json` is used only for claude-flow native module dependencies. It MUST contain `"name"` and `"version"` fields or `npm install` will fail with `Invalid Version`. Added 2026-02-14:

```json
{
  "name": "healthcare-orchest-cib7",
  "version": "1.0.0",
  "private": true,
  "dependencies": { ... }
}
```

### System Capabilities After Bootstrap (Verified 2026-02-14)

| Component | Status | Details |
|-----------|--------|---------|
| CLI Version | ✅ v3.1.0-alpha.39 | Minimum required: >= 3.1.0 |
| Daemon | ✅ Running | 5 workers enabled, 2 max concurrent |
| MCP Servers | ✅ 3 connected | claude-flow, ruv-swarm, flow-nexus |
| Memory DB | ✅ Operational | .swarm/memory.db, hybrid backend, 10 tables |
| Embeddings | ✅ ONNX 384-dim | all-MiniLM-L6-v2, semantic search functional |
| HNSW Index | ✅ Configured | cosine metric, M=16, ef=200/100 |
| Neural Models | ✅ 3 trained | MOE + transformer + classifier |
| ReasoningBank | ✅ 4,000 patterns | Growing with each training run |
| Hive-Mind | ✅ Initialized | hierarchical-mesh, byzantine consensus |
| Agent Configs | ✅ 5 built | coder, architect, tester, security-architect, reviewer |
| Pretrained Intelligence | ✅ 84 files → 30 patterns, 16 strategies | hooks pretrain |

---

## Stored Workflow Patterns (Memory Keys)

**CRITICAL:** These patterns are stored in claude-flow memory and MUST be followed for all swarm operations.

### Pattern: Complete Swarm Workflow

**Memory Key:** `pattern-complete-swarm-workflow`

**Workflow:**

1. **PRE-SPAWN (5 steps, sequential)**
   - `hooks pre-task` — Register task, get routing recommendation
   - `memory store scope` — Store task scope for swarm agents to retrieve
   - `hive-mind init` — Initialize coordination (hierarchical-mesh topology)
   - `hive-mind status` — Verify initialization
   - Display spawn command — Code block for user to copy-paste to separate terminal

2. **SPAWN (user-executed)**
   - User copies command to separate terminal
   - User monitors progress
   - User notifies agent when complete

3. **POST-TASK (2 core steps + conditional)**
   - `memory store` — Store completion with results summary
   - `hooks post-task` — Record completion status
   - `neural train` — Only if significant new code patterns
   - `pattern store` — Only if reusable pattern discovered

**RULE:** Memory holds state, NOT HANDOFF.yaml updates after every swarm.

### Pattern: Benchmark Prompt Structure

**Memory Key:** `pattern-prompt-structure-benchmark`

**Structure (mandatory for all swarm objectives):**

```text
SWARM [NAME]: [SCOPE SUMMARY] | [metrics] | [file count] | [key metric]

MEMORY: [key1], [key2], [key3]
WORKSPACE: [absolute path]
PYTHON: [version]

PRIMARY DELIVERABLES:
1. [exact/file/path.py]
2. [exact/file/path.py]

    ANTI-PATTERNS TO AVOID:
    ❌AP1: Queen coding directly — DELEGATE to specialist agents
    ❌AP2: Batch updates — each agent works on specific subset only
    ❌AP3: Skip verification — MUST validate all changes
    ❌AP4: Manual grep commands — use workspace tools and code analysis
    ❌AP5: Agent introspection loop — do NOT run hooks statusline/hive-mind status in place of actual file reads
    ❌AP6: Missing per-worker exit gate — MUST verify own memory key was stored (> 500 bytes) before declaring done
    ❌AP7: Synthesizer starting without upstream gate — check ALL required memory keys exist BEFORE writing any report
    ❌AP8: Monolithic swarm for dependent dimensions — split into parallel swarms (A, B, C) + dependent synthesis swarm (D)
    ❌ [domain-specific antipattern]━━━ EXISTING CODE (READ BEFORE WRITING) ━━━
[MODULE]: [path]
  [ClassName].[method](args) → return_type
  [key constants, mappings, patterns]

━━━ PHASE [X]1: RECON (1 agent) ━━━
READ: [exact files]
MAP: [what to extract]
OUTPUT: internal report for Phase [X]2

━━━ PHASE [X]2: CODER (N agents, parallel if split) ━━━
CREATE/MODIFY: [exact file paths]
[Numbered items with exact specs per file]
VALIDATE: [command]

━━━ PHASE [X]3: VERIFIER (1 agent) ━━━
V1: [command] → [expected result]
V2: [command] → [expected result]
...

━━━ EXIT CRITERIA ━━━
✅ [criterion with measurable check]
✅ [criterion with measurable check]

ROLLBACK: [recovery command if fails]
```

**Key Prompt Rules:**

- **Line 1**: "DELEGATE DO NOT CODE" (or encoded in swarm name)
- **3-Tier Minimum**: RECON → CODER → VERIFIER sequential tiers
- **Exact Paths**: No ambiguity in file/function references
- **Exact Signatures**: Agents don't guess APIs
- **Exact Validation**: V-checks with expected output
- **Memory Keys**: Single line, comma-separated
- **Anti-Patterns**: Explicit list with ❌ prefix
- **Exit Criteria**: ✅ checkmarks with grep/wc/pytest commands
- **Rollback**: Recovery procedure if pass rate drops

**Retrieval:**

```bash
npx @claude-flow/cli@latest memory retrieve \
  --key "pattern-complete-swarm-workflow" \
  --namespace healthcare-platform

npx @claude-flow/cli@latest memory retrieve \
  --key "pattern-prompt-structure-benchmark" \
  --namespace healthcare-platform
```

---

## Related ADRs

- ADR-001: CIB Seven as BPM Engine
- ADR-003: Python External Task Workers
- ADR-009: Mono-repo folder per concern
- ADR-010: Observability stack (logs, metrics)
- ADR-019: BPMN Compliance Mandatory

---

## References

- [claude-flow CLI Documentation](https://github.com/rodaquinoDev/claude-flow)
- [RuVector HNSW Implementation](https://github.com/rodaquinoDev/ruvector)
- [Byzantine Consensus Primer](https://en.wikipedia.org/wiki/Byzantine_fault)
- [Swarm Execution Strategy](./docs/Technical%20specification/SWARM_EXECUTION_STRATEGY.md)

---

**Next Steps:**

1. Team training on claude-flow CLI (scheduled 2026-02-10)
2. Execute Phase 0 of swarm strategy (memory preparation)
3. Pilot swarm execution on revenue cycle domain
4. Measure cost savings and quality metrics
5. Iterate and scale to all domains
