# Outcome

一键 API 渠道配置在获取文本模型时，排除模型名称中包含 `image` 的非文本模型，避免它们被写入文本渠道。

# Scope

- 调整一键 API 渠道配置抽屉中的文本模型筛选。
- 同步用户可测试变更记录和版本级变更说明。

# Non-goals

- 不调整生图模型渠道的筛选和创建逻辑。
- 不修改全局模型能力推断规则或已经保存的渠道。
- 不根据模型名称以外的元数据扩展模型分类。

# Acceptance examples

- A1：文本密钥返回 `gpt-image-1`、`IMAGE-preview` 等名称包含 `image` 的模型时，这些模型不会进入新建或更新的文本渠道。
- A2：文本密钥返回名称不包含 `image` 且被识别为文本能力的模型时，这些模型仍正常进入文本渠道。
- A3：画图密钥获取及 Gemini、GPT 生图渠道的创建流程保持不变。

# Constraints and invariants

- `image` 匹配不区分大小写。
- 过滤发生在调用 `createModelChannel` 创建文本渠道之前。
- 遵循现有一键配置结构，不新增通用抽象。
- 禁止修改画布原有源码逻辑；实现仅在新增的一键配置渠道代码中做最小调整。

# Decisions

- 在文本模型列表入口显式过滤名称包含 `image` 的模型，作为独立于 `guessCapability` 关键词表的业务约束。
- 不修改画布组件、画布状态、通用模型能力推断或其他原有业务逻辑。

# Open questions

# Verification expectations

- 静态核对文本模型筛选同时要求模型能力为 `text` 且小写名称不包含 `image`。
- 静态核对生图渠道筛选与创建代码未被修改。
