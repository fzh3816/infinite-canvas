# Outcome

按当前访问域名选择一份完整的 API 提供方配置，使 Lingyun 与 Nuona 的品牌、模型接口、价格接口和教程/文档地址只在 `web/src/lib/preset-api-provider.ts` 中维护；同时让本地 AI/编辑器/Comet 配置目录不再被 Git 跟踪或提交到远程。

# Scope

- 将 Lingyun 与 Nuona 的域名匹配项、品牌名称、渠道前缀、模型 API 地址、价格代理路径、配置教程、使用教程和文档地址集中为两份配置对象。
- 一键渠道配置抽屉、首页使用教程、全局文档入口和价格查询均消费当前提供方配置。
- Nginx 使用两个固定价格代理路径分别连接 `new-api:3000` 与 `new-api-nuona:3000`，不再重复判断访问域名。
- 根目录 `.gitignore` 忽略 `.agent/`、`.agents/`、`.claude/`、`.codex/`、`.comet/`、`.cursor/`。
- 已被 Git 跟踪的上述目录仅从索引移除，本地文件保留。

# Non-goals

- 不迁移或兼容旧的浏览器渠道数据。
- 不删除本地工具配置目录及其内容。
- 不移除根目录的 `AGENTS.md`、`CLAUDE.md` 等未被用户列出的独立文件。
- 不为 Nuona 编写真实文档内容；当前只使用占位地址。

# Acceptance examples

- A1：访问域名包含 `lingyunapi.com` 时，选中 Lingyun 配置；模型地址为 `https://image.lingyunapi.com`，配置教程与文档地址为 `https://b2wm53yf7h.apifox.cn/9200514m0`，使用教程为 `https://b2wm53yf7h.apifox.cn/9200522m0`，价格请求使用 Lingyun 代理路径。
- A2：访问域名包含 `nuona.vin` 时，选中 Nuona 配置；模型地址为 `https://api.nuona.vin`，配置教程、使用教程和文档地址暂时均为 `https://aaa.com`，价格请求使用 Nuona 代理路径。
- A3：一键配置按钮、抽屉标题、保存的渠道名与地址、抽屉教程链接、价格查询、首页使用教程、顶部文档入口均只读取已选中的提供方配置，不再包含各自的域名判断或提供方 URL 常量。
- A4：`/proxy/lingyun-pricing` 转发到 `new-api:3000/api/pricing`，`/proxy/nuona-pricing` 转发到 `new-api-nuona:3000/api/pricing`，Nginx 配置中不再按 `$host` 分支。
- A5：六个本地工具目录均被根 `.gitignore` 忽略；原先已跟踪的 `.agents/` 文件从 Git 索引移除，但磁盘上的目录和文件保持存在。

# Constraints and invariants

- Lingyun 现有用户可见行为与地址保持不变。
- 未匹配已知域名的本地开发环境继续默认使用 Lingyun 配置。
- 遵循现有 React、Ant Design 和全局配置入口写法，不新增状态管理或组件抽象。
- 按项目规则不执行构建、测试或语法检查。

# Decisions

- 使用当前 Git 工作目录承接已有未提交修改。
- Nuona 的配置教程、使用教程和文档地址当前统一使用 `https://aaa.com`。
- 同时忽略用户写出的 `.agent/` 与仓库实际存在的 `.agents/`。
- Docker 上游属于 Nginx 基础设施配置；浏览器侧通过提供方 JSON 中不同的价格代理路径选择对应上游。

# Open questions

无。

# Verification expectations

- 只读检查最终差异、提供方硬编码搜索结果、Git 忽略结果和索引状态。
- 不执行项目构建、测试或语法检查。
