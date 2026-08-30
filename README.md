# rubber-duck

一套约束 AI 编码助手（Cursor / Codex 等）「何时动手、怎么动手、何时交付」的规则。核心理念：**先对齐再动手，排障先证伪再改，交付以真验收面为准。**

名字致敬橡皮鸭调试法（Rubber Duck Debugging）：先对着鸭子把问题讲清楚，再动手——正是这套规则的出发点。

## 三条规则

| 规则 | 角色 | 管什么 |
|------|------|--------|
| `core-decision-memory-comms` | 总路由 | 沟通克制一致；决策门（排障/选型/实现/灰区）；落盘记忆 |
| `troubleshoot-hard-gate` | 排障硬闸 | 排障时「证据 → 根因 → 停下等授权」，未授权禁止换库/换架构/大改呈现 |
| `converge-before-shipping` | 横切交付护栏 | 常见需求选主流解；一次只改一条主线；以真机/真环境验收，不拿代理环境冒充 |

**关系**：`core` 是总协议，其「排障」分支的细则展开成 `troubleshoot-hard-gate`；`converge-before-shipping` 不是某个分支的后一步，而是贯穿排障、选型、实现始终的**横切护栏**，与另两条是「叠加」而非「先后」关系。

## 目录结构

```
rules/            语义源（跨工具通用稿，无 frontmatter）
  core-decision-memory-comms.md
  troubleshoot-hard-gate.md
  converge-before-shipping.md
install/          安装副本（由语义源生成）
  cursor/         带 Cursor frontmatter 的 .mdc
```

**语义源为准**：改规则先改 `rules/`，再同步到 `install/cursor/`。

## 安装

### 方式一：按仓库（推荐，Cursor / Codex 通用）

把三条 `rules/*.md` 的内容合并，放到目标仓库根目录的 `AGENTS.md`。Cursor 与 Codex 都会读取项目级 `AGENTS.md`。

### 方式二：Cursor 全局

把 `install/cursor/` 下三个 `.mdc` 复制到 `~/.cursor/rules/`。

### 方式三：Codex 全局

将三条 `rules/*.md` 内容放入 Codex 用户 instructions / 全局 `AGENTS.md`（以当前 Codex 版本文档为准）。

**注意**：同一工具内不要同时叠多份全文，以免重复注入。

## 依赖说明

规则中提到 `docs/session-handoff.md`（会话落盘文档）与 `session-handoff` skill（技能说明），二者均为**可选依赖**：不存在时直接创建/更新 `docs/session-handoff.md` 即可，规则不依赖任何本机绝对路径。

## License

[MIT](./LICENSE)
