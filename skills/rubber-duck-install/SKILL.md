---
name: rubber-duck-install
description: >-
  安装 rubber-duck 总路由 rule 与全部 rubber-duck-* skills 到当前编码 Agent。
  用户说「安装 rubber-duck」或给出本仓库 GitHub 链接并要求安装时使用。
---

# rubber-duck-install

用户说「安装 rubber-duck」时，由你完成安装，不要默认让用户跑终端。`cli/install.mjs` 仅作后备。

## 目标

一次装齐：

1. **唯一 always-on rule**：`rubber-duck`（沟通 + 决策门 + 红线 + skill 路由）
2. **全部 skills**（按需）：`rubber-duck-troubleshoot`、`rubber-duck-ship`、`rubber-duck-handoff`、`rubber-duck-install`

清理旧名（若存在则删除）：

- rules：`core-decision-memory-comms.*`、`troubleshoot-hard-gate.*`、`converge-before-shipping.*`
- skills 目录：`troubleshoot-hard-gate`、`converge-before-shipping`、`session-handoff`、`install-rubber-duck`

## 1. 定位本仓库源文件

1. 当前工作区若已是 `rubber-duck` 仓库 → 用仓库根目录
2. 否则若用户给出了本地路径或已 clone 的路径 → 用该路径
3. 否则 clone：`https://github.com/WilliamStellaAI/rubber-duck.git`，再安装

| 源 | 用途 |
|----|------|
| `rules/rubber-duck.md` | 非 Cursor 的总路由 rule |
| `install/cursor/rubber-duck.mdc` | 仅 Cursor |
| `skills/rubber-duck-*/` | 全部按需 skill |

## 2. 识别当前工具并写入目标

### Cursor

- 用户级（默认）：
  - 拷贝 `install/cursor/rubber-duck.mdc` → `~/.cursor/rules/`
  - 删除旧名 rule 文件（见上）
  - 拷贝 `skills/rubber-duck-*/` → `~/.cursor/skills/<name>/`；删除旧名 skill 目录
- 项目级：目标改为 `<项目>/.cursor/…`

### Codex

- 用户级：把 `rules/rubber-duck.md` 合并进 `~/.codex/AGENTS.md`（标记 `<!-- rubber-duck:start -->` … `<!-- rubber-duck:end -->`）
- skills → `~/.agents/skills/`（可兼写 `~/.codex/skills/`）
- 项目级：项目 `AGENTS.md` + `.agents/skills/`

### Trae

- 用户级：`rules/rubber-duck.md` → `~/.trae/user_rules/`（若 `user_rules` 已是文件，改写入 `~/.trae/rules/`）
- skills → `~/.trae/skills/`
- 项目级：`.trae/rules` + `.trae/skills`

### CodeBuddy

- `~/.codebuddy/rules/` + `~/.codebuddy/skills/`（或项目 `.codebuddy/…`）

### WorkBuddy

- `~/.workbuddy/rules/` + `~/.workbuddy/skills/`（或项目 `.workbuddy/…`）
- **不要**写成 `~/.codebuddy/`

## 3. 执行方式

1. 文件工具 / shell 复制（推荐）
2. 后备：`node cli/install.mjs --tool <cursor|codex|trae|codebuddy|workbuddy> [--scope user|project]`

## 4. 装完后回复用户

- 工具 + user/project
- rule 路径 + skills 列表
- 清理掉的旧名（若有）
- **请新开一轮 Agent 会话**
- 排障 / 收敛 / 落盘 分别走 `rubber-duck-troubleshoot` / `rubber-duck-ship` / `rubber-duck-handoff`；红线在 `rubber-duck` rule 每轮仍在

## 反模式

- 只装 rule、漏装 skills
- 把 skill 正文再做成 always-on rule
- WorkBuddy 写成 CodeBuddy 路径
- 把密钥写入仓库文档
