# 验证情况

等级：`design-only`

## 做过的

- 用 `skill-craft` 的 `check_skill.py` 查过结构，退出码 0。
- 描述改成同时写何时使用、何时不用，并加了用户会说的原话（「落个盘」「handoff」「整理一下会话摘要」）。

## 还差

- 四份评测文件写好了，但没真跑过一次落盘。`evals/evals.json` 里三条都是判断，不是能机械核对的产物。
- `evals/negatives.json` 的三条反例都是内容问题（写了密钥、贴了整段聊天、覆盖了旧决策），`check_skill.py` 查不了，只能靠人看落盘文档。
- 触发组八句没测过。
- 没有和旧版做同题对比。

补完触发测试才能到 `mock-tested`，真用它落过几次盘才到 `business-read-verified`。
