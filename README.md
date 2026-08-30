# rubber-duck

一套约束 AI 编码助手（Cursor / Codex / Trae / CodeBuddy 等）「何时动手、怎么动手、何时交付」的规则。核心理念：**先对齐再动手，排障先证伪再改，交付以真验收面为准。**

名字致敬橡皮鸭调试法（Rubber Duck Debugging）：先对着鸭子把问题讲清楚，再动手——正是这套规则的出发点。

## 一句话安装（推荐）

**不用自己开终端。** 在当前 coding agent 里说一句即可，例如：

> 请按 https://github.com/WilliamStellaAI/rubber-duck 里的 `skills/install-rubber-duck/SKILL.md`，把 rubber-duck 装到我这个 Agent（用户级）。

Agent 会自行读取该 skill、拉取/定位仓库，并把 **规则 + `session-handoff` skill** 拷到本工具约定目录。装完后**新开一轮会话**再用来生效。

若当前工作区已经是本仓库，说「安装 rubber-duck」即可，Agent 应执行 `skills/install-rubber-duck/SKILL.md`。

## 组成

| 组件 | 形态 | 角色 |
|------|------|------|
| `core-decision-memory-comms` | 全局 rule | 总路由：沟通；决策门（排障/选型/实现/灰区）；落盘触发摘要 |
| `troubleshoot-hard-gate` | 全局 rule | 排障硬闸：证据 → 根因 → 停下等授权 |
| `converge-before-shipping` | 全局 rule | 横切交付护栏：主流解、一条主线、真验收面 |
| `session-handoff` | **skill（按需）** | 落盘细则：怎么写、必备章节；默认写入 `docs/session-handoff.md` |
| `install-rubber-duck` | **skill（按需）** | 教 Agent 如何把本仓库装进各工具目录 |

**关系**：

- `core` 是总协议：其「排障」分支 → `troubleshoot-hard-gate`（rule）；其「落盘」第 3 节 → **路由到** `session-handoff` skill（仅在触发时读入上下文）。
- `converge-before-shipping` 是贯穿始终的横切护栏，与另几条是「叠加」而非「先后」。

## 目录结构

```
rules/                         规则语义源（跨工具通用稿，无 frontmatter）
skills/session-handoff/        落盘 skill（按需）
skills/install-rubber-duck/    给 Agent 用的安装 skill（一句话安装）
install/cursor/                仅 Cursor 的预生成 .mdc 副本（见该目录 README）
cli/install.mjs                可选：终端安装后备
```

**为何有 `install/cursor/`？**  
语义源在 `rules/`。只有 Cursor 需要带 `alwaysApply` 等 frontmatter 的 `.mdc`，故单独预生成；Codex / Trae / CodeBuddy 安装时直接读 `rules/*.md`，不设 `install/codex` 等平行目录，避免重复漂移。说明见 [`install/cursor/README.md`](./install/cursor/README.md)。

**语义源为准**：改规则先改 `rules/`，再同步 `install/cursor/`；改落盘只改 `skills/session-handoff/`。

## 各工具写入位置

| 工具 | 用户级 rules | 用户级 skill | 项目级 |
|------|--------------|--------------|--------|
| Cursor | `~/.cursor/rules/*.mdc` | `~/.cursor/skills/session-handoff/` | `.cursor/rules` + `.cursor/skills` |
| Codex | `~/.codex/AGENTS.md`（标记块） | `~/.agents/skills/`（兼写 `~/.codex/skills/`） | `AGENTS.md` + `.agents/skills/` |
| Trae | `~/.trae/user_rules/*.md` | `~/.trae/skills/` | `.trae/rules` + `.trae/skills` |
| CodeBuddy / WorkBuddy | `~/.codebuddy/rules/*.md` | `~/.codebuddy/skills/` | `.codebuddy/rules` + `.codebuddy/skills` |

`workbuddy` 与 `codebuddy` 同一路径约定。

## 可选：终端安装

需要自己跑命令时，可用 Node.js（建议 ≥ 18，非硬性 API 依赖）：

```bash
git clone https://github.com/WilliamStellaAI/rubber-duck.git
cd rubber-duck
node cli/install.mjs --tool cursor          # 或 codex / trae / codebuddy / workbuddy / all
node cli/install.mjs --tool all --dry-run
```

| 参数 | 说明 |
|------|------|
| `--tool` | `cursor` / `codex` / `trae` / `codebuddy` / `workbuddy` / `all` |
| `--scope` | `user`（默认）或 `project` |
| `--project` | 项目根（`--scope project` 时） |
| `--dry-run` | 只打印路径 |
| `--force` | 强制覆盖 |

## 落盘文档

触发后由 `session-handoff` skill 读写各项目内 `docs/session-handoff.md`。没有则创建。

## License

[MIT](./LICENSE)
