---
name: install-rubber-duck
description: >-
  将 rubber-duck 规则与 session-handoff skill 安装到当前编码 Agent 约定目录。
  在用户说「安装 rubber-duck」「一键安装这套规则」「帮我装上 rubber-duck」
  或提到要启用决策门/落盘/排障硬闸规则时使用。
---

# 安装 rubber-duck（由 Agent 执行）

用户用**一句话**要求安装时，由你（当前 coding agent）完成本流程，**不要**默认让用户自己开终端跑命令。`cli/install.mjs` 仅作可选后备。

## 目标

一次装齐：

1. 三条全局规则（决策门 / 排障硬闸 / 收敛交付）
2. `session-handoff` skill（按需落盘）

## 1. 定位本仓库源文件

优先顺序：

1. 当前工作区若已是 `rubber-duck` 仓库 → 用仓库根目录
2. 否则若用户给出了本地路径或已 clone 的路径 → 用该路径
3. 否则 clone：`https://github.com/WilliamStellaAI/rubber-duck.git` 到临时目录或用户指定目录，再安装

需要的源路径（相对仓库根）：

| 源 | 用途 |
|----|------|
| `rules/*.md` | 非 Cursor 的规则正文 |
| `install/cursor/*.mdc` | 仅 Cursor 规则 |
| `skills/session-handoff/` | 各工具共用的落盘 skill |

## 2. 识别当前工具并写入目标

按**正在对话的这个 Agent**选择（用户若明确指定工具则听用户的）：

### Cursor

- 用户级（默认）：
  - 拷贝 `install/cursor/*.mdc` → `~/.cursor/rules/`
  - 拷贝 `skills/session-handoff/` → `~/.cursor/skills/session-handoff/`
- 项目级（用户说「只装这个项目」）：
  - → `<项目>/.cursor/rules/` 与 `<项目>/.cursor/skills/session-handoff/`

### Codex

- 用户级：把 `rules/*.md` 合并进 `~/.codex/AGENTS.md`（用标记 `<!-- rubber-duck:start -->` … `<!-- rubber-duck:end -->` 包裹；已有标记则替换中间内容）
- skill：`skills/session-handoff/` → `~/.agents/skills/session-handoff/`（可兼写 `~/.codex/skills/session-handoff/`）
- 项目级：合并进项目 `AGENTS.md`；skill → `<项目>/.agents/skills/session-handoff/`

### Trae

- 用户级：`rules/*.md` → `~/.trae/user_rules/`（若 `user_rules` 已是文件，改写入 `~/.trae/rules/`）
- skill → `~/.trae/skills/session-handoff/`
- 项目级：→ `<项目>/.trae/rules/` 与 `<项目>/.trae/skills/session-handoff/`

### CodeBuddy / WorkBuddy

- 用户级：`rules/*.md` → `~/.codebuddy/rules/`；skill → `~/.codebuddy/skills/session-handoff/`
- 项目级：→ `<项目>/.codebuddy/rules/` 与 `<项目>/.codebuddy/skills/session-handoff/`
- WorkBuddy 与 CodeBuddy 使用同一路径约定

## 3. 执行方式

1. 直接用文件工具 / shell 创建目录并复制（推荐）
2. 若环境已有 Node ≥ 18，且用户接受跑命令，可后备执行：

```bash
node cli/install.mjs --tool <cursor|codex|trae|codebuddy|workbuddy> [--scope user|project]
```

不要把「打开终端跑 CLI」当成默认步骤。

## 4. 装完后回复用户

必须说明：

- 装到了哪个工具、user 还是 project
- 写入的主要路径列表
- **请新开一轮 Agent 会话**后再用（否则可能仍读旧规则）
- 以后说「落盘 / handoff」时，应由 `session-handoff` skill 执行

## 反模式

- 只装 rules、漏装 `session-handoff` skill
- 把 skill 正文再做成 always-on rule（浪费上下文）
- 未确认工具就写错目录
- 把密钥或绝对机器隐私路径写进仓库文档
