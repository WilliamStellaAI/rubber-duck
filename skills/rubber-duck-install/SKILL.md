---
name: rubber-duck-install
description: >-
  仓库内安装剧本（不装进用户 Agent）。用户说「安装 rubber-duck」或打开本仓库要求安装时，
  由 Agent 读取本文件并执行；安装目标仅为 rubber-duck rule + troubleshoot/ship/handoff 三个 skill。
---

# rubber-duck-install（仅存仓库）

**本文件只放在 GitHub / 本仓库里**，给「还没装上 rubber-duck」的 Agent 读。  
装完后**不要**再拷贝到 `~/.cursor/skills/` 等用户目录——装上了就不需要再「教安装」。

用户说「安装 rubber-duck」时：clone/打开本仓库 → 读本文件 → 按下面拷贝。不要默认让用户跑终端。

## 装什么

1. **rule**：`rubber-duck`（唯一 always-on）
2. **skills**：仅 `rubber-duck-troubleshoot`、`rubber-duck-ship`、`rubber-duck-handoff`

每个 skill 目录整份复制，包括 `evals/`（评测用例）和 `references/verification.md`（证据等级）。它们是技能自带的，不是可选附件。

不要安装本 `rubber-duck-install` 目录。  
清理旧名：`core-decision-memory-comms`、`troubleshoot-hard-gate`、`converge-before-shipping`、`session-handoff`、`install-rubber-duck`，以及误装的 `rubber-duck-install`。

## 源路径（相对仓库根）

| 源 | 用途 |
|----|------|
| `rules/rubber-duck.md` | 非 Cursor |
| `install/cursor/rubber-duck.mdc` | 仅 Cursor |
| `skills/rubber-duck-troubleshoot/` 等三个 | 按需 skill |

## 目标目录

| 工具 | rule | skills |
|------|------|--------|
| Cursor | `~/.cursor/rules/rubber-duck.mdc` | 见下面「Cursor 的 skills 放哪」 |
| Codex | `~/.codex/AGENTS.md` 标记块 | `~/.agents/skills/`（可兼写 `~/.codex/skills/`） |
| Trae | `~/.trae/user_rules/` | `~/.trae/skills/` |
| CodeBuddy | `~/.codebuddy/rules/` | `~/.codebuddy/skills/` |
| WorkBuddy | `~/.workbuddy/rules/` | `~/.workbuddy/skills/`（勿用 `.codebuddy`） |

项目级：把 `~` 换成项目下的 `.cursor` / `.agents` / `.trae` / `.codebuddy` / `.workbuddy`。

### Cursor 的 skills 放哪

Cursor 读两处，任选其一：

- 个人技能库：`~/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/<store-id>/files/skills/`（macOS；不同 store-id 对应不同账号）
- 传统目录：`~/.cursor/skills/`

不确定时用 `~/.cursor/skills/`，它一定被读。若已经在个人技能库里装过，别在另一处再装一份：两处同名会各读各的，改一处另一处不跟着变。

`cli/install.mjs --tool cursor` 装的是 `~/.cursor/skills/`。

## 执行

直接复制文件；或后备：`node cli/install.mjs --tool <name>`（安装器已跳过 `rubber-duck-install`）。

安装器默认不覆盖已被改过的文件。它会把这类文件列成 `skip-modified`；确认要用仓库版本覆盖时才加 `--force`。

## 装完回复

写出工具、路径、已删旧名；请用户**新开一轮会话**。
