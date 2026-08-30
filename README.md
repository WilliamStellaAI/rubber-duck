# rubber-duck

一套约束 AI 编码助手（Cursor / Codex / Trae / CodeBuddy 等）「何时动手、怎么动手、何时交付」的规则。核心理念：**先对齐再动手，排障先证伪再改，交付以真验收面为准。**

名字致敬橡皮鸭调试法（Rubber Duck Debugging）：先对着鸭子把问题讲清楚，再动手——正是这套规则的出发点。

## 组成

| 组件 | 形态 | 角色 |
|------|------|------|
| `core-decision-memory-comms` | 全局 rule | 总路由：沟通；决策门（排障/选型/实现/灰区）；落盘触发摘要 |
| `troubleshoot-hard-gate` | 全局 rule | 排障硬闸：证据 → 根因 → 停下等授权 |
| `converge-before-shipping` | 全局 rule | 横切交付护栏：主流解、一条主线、真验收面 |
| `session-handoff` | **skill（按需）** | 落盘细则：怎么写、必备章节；默认写入 `docs/session-handoff.md` |

**关系**：

- `core` 是总协议：其「排障」分支 → `troubleshoot-hard-gate`（rule）；其「落盘」第 3 节 → **路由到** `session-handoff` skill（仅在触发时读入上下文，避免每轮浪费）。
- `converge-before-shipping` 是贯穿始终的横切护栏，与另几条是「叠加」而非「先后」。

## 目录结构

```
rules/                         规则语义源（跨工具通用稿，无 frontmatter）
skills/session-handoff/        落盘 skill（按需）
install/cursor/                Cursor 规则安装副本（.mdc）
cli/install.mjs                一键安装器
```

**语义源为准**：改规则先改 `rules/`，再同步到 `install/cursor/`；改落盘流程只改 `skills/session-handoff/`。

## 一键安装（推荐）

需要 Node.js ≥ 18。

```bash
# 克隆后本地安装
git clone https://github.com/WilliamStellaAI/rubber-duck.git
cd rubber-duck
node cli/install.mjs --tool cursor

# 或一次性装本机已检测到的工具
node cli/install.mjs --tool all
```

| 参数 | 说明 |
|------|------|
| `--tool` | `cursor` / `codex` / `trae` / `codebuddy` / `workbuddy` / `all` |
| `--scope` | `user`（默认，用户级）或 `project`（项目级） |
| `--project` | 项目根路径（`--scope project` 时，默认当前目录） |
| `--dry-run` | 只打印将写入的路径，不落盘 |
| `--force` | 强制覆盖已有文件 |

### 各工具写入位置

| 工具 | 用户级 rules | 用户级 skill | 项目级 |
|------|--------------|--------------|--------|
| Cursor | `~/.cursor/rules/*.mdc` | `~/.cursor/skills/session-handoff/` | `.cursor/rules` + `.cursor/skills` |
| Codex | `~/.codex/AGENTS.md`（标记块） | `~/.agents/skills/`（兼写 `~/.codex/skills/`） | `AGENTS.md` + `.agents/skills/` |
| Trae | `~/.trae/user_rules/*.md` | `~/.trae/skills/` | `.trae/rules` + `.trae/skills` |
| CodeBuddy / WorkBuddy | `~/.codebuddy/rules/*.md` | `~/.codebuddy/skills/` | `.codebuddy/rules` + `.codebuddy/skills` |

`workbuddy` 与 `codebuddy` 使用同一路径约定（CodeBuddy 目录）。

安装后请**新开 Agent 会话**再验证。

## 手动安装

### Cursor

```bash
cp install/cursor/*.mdc ~/.cursor/rules/
mkdir -p ~/.cursor/skills
cp -R skills/session-handoff ~/.cursor/skills/
```

### 仅合并进仓库 AGENTS.md

把 `rules/*.md` 合并进项目 `AGENTS.md`，并把 `skills/session-handoff/` 拷到该工具会扫描的 skills 目录。

**注意**：同一工具内不要叠多份规则全文；`session-handoff` 不要再做成 always-on rule。

## 落盘文档

触发后由 skill 读写各项目仓库内的 `docs/session-handoff.md`。没有则创建。不依赖本机绝对路径。

## License

[MIT](./LICENSE)
