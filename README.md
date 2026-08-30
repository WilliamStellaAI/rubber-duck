# rubber-duck

一套约束 AI 编码助手（Cursor / Codex / Trae / CodeBuddy / WorkBuddy 等）「何时动手、怎么动手、何时交付」的规则。核心理念：**先对齐再动手，排障先证伪再改，交付以真验收面为准。**

名字致敬橡皮鸭调试法（Rubber Duck Debugging）：先对着鸭子把问题讲清楚，再动手——正是这套规则的出发点。

## 一句话安装（推荐）

对当前 Agent 说：

> 安装 rubber-duck（https://github.com/WilliamStellaAI/rubber-duck）

装完后新开一轮会话。

## 命名与架构

| 组件 | 形态 | 角色 |
|------|------|------|
| `rubber-duck` | **唯一 always-on rule** | 沟通 + 决策门 + **红线** + skill 路由 |
| `rubber-duck-troubleshoot` | skill（装进 Agent） | 排障硬闸 + 四问 |
| `rubber-duck-ship` | skill（装进 Agent） | 收敛交付 |
| `rubber-duck-handoff` | skill（装进 Agent） | 会话落盘（写入 `docs/session-handoff.md`） |
| `rubber-duck-install` | **仅存仓库** | 首次安装剧本；**不**拷进用户 Agent |

**原则**：红线留在每轮注入的 `rubber-duck`；长文细则进三个运行时 skill。安装说明只在仓库里读一次，装完即丢。

## 目录结构

```
rules/rubber-duck.md
skills/
  rubber-duck-troubleshoot/   # 装进 Agent
  rubber-duck-ship/
  rubber-duck-handoff/
  rubber-duck-install/        # 仅仓库；安装器不会拷走
install/cursor/rubber-duck.mdc
cli/install.mjs
```

为何有 `install/cursor/`：只有 Cursor 需要带 `alwaysApply` 的 `.mdc`。见 [`install/cursor/README.md`](./install/cursor/README.md)。

## 各工具写入位置

| 工具 | 用户级 rule | 用户级 skills |
|------|-------------|---------------|
| Cursor | `~/.cursor/rules/rubber-duck.mdc` | `~/.cursor/skills/rubber-duck-*/` |
| Codex | `~/.codex/AGENTS.md`（标记块） | `~/.agents/skills/`（兼写 `~/.codex/skills/`） |
| Trae | `~/.trae/user_rules/` | `~/.trae/skills/` |
| CodeBuddy | `~/.codebuddy/rules/` | `~/.codebuddy/skills/` |
| WorkBuddy | `~/.workbuddy/rules/` | `~/.workbuddy/skills/` |

## 可选：终端安装

```bash
git clone https://github.com/WilliamStellaAI/rubber-duck.git
cd rubber-duck
node cli/install.mjs --tool cursor   # 或 codex / trae / codebuddy / workbuddy / all
```

会安装 `rubber-duck` rule + 全部 `rubber-duck-*` skills，并清理旧文件名。

## License

[MIT](./LICENSE)
