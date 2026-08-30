# install/cursor

这里**不是**「本项目只支持 Cursor」。

`rules/rubber-duck.md` 是跨工具语义源。Cursor 额外需要带 YAML frontmatter 的 `.mdc`（`description` / `alwaysApply`），故预生成 `rubber-duck.mdc`。

| 路径 | 谁用 |
|------|------|
| `rules/rubber-duck.md` | 各工具唯一 always-on 语义源 |
| `install/cursor/rubber-duck.mdc` | 仅 Cursor |
| `skills/rubber-duck-*/` | 按需 skill |

改规则：先改 `rules/rubber-duck.md`，再同步本目录 `.mdc`。
