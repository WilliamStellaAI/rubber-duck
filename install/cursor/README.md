# install/cursor

这里**不是**「本项目只支持 Cursor」。

`rules/` 才是跨工具语义源。Cursor 额外需要带 YAML frontmatter 的 `.mdc`（`description` / `alwaysApply`），所以在安装前预生成一份副本，供 Cursor 与安装器直接拷贝。

| 路径 | 谁用 |
|------|------|
| `rules/*.md` | Codex / Trae / CodeBuddy 等（安装器现读现写） |
| `install/cursor/*.mdc` | 仅 Cursor |

改规则：先改 `rules/`，再同步改本目录 `.mdc`，避免两套内容漂移。
