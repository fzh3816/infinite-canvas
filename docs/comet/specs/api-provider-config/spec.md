# API 提供方配置

## 配置模型

系统必须在 `web/src/lib/preset-api-provider.ts` 中维护 Lingyun 与 Nuona 的完整配置对象。每个对象必须包含域名匹配信息、提供方标识与名称、渠道前缀、模型 API 地址、价格代理路径、配置教程地址、使用教程地址和文档地址。

系统必须只在该模块中根据当前访问域名选择配置。域名包含 `nuona.vin` 时选择 Nuona，包含 `lingyunapi.com` 时选择 Lingyun；其他域名默认选择 Lingyun。

## Lingyun

- 模型 API：`https://image.lingyunapi.com`
- 配置教程：`https://b2wm53yf7h.apifox.cn/9200514m0`
- 使用教程：`https://b2wm53yf7h.apifox.cn/9200522m0`
- 文档：`https://b2wm53yf7h.apifox.cn/9200514m0`
- 价格代理：`/proxy/lingyun-pricing`

## Nuona

- 模型 API：`https://api.nuona.vin`
- 配置教程：`https://aaa.com`
- 使用教程：`https://aaa.com`
- 文档：`https://aaa.com`
- 价格代理：`/proxy/nuona-pricing`

## 消费方

一键渠道配置入口与抽屉必须从所选配置读取品牌、渠道前缀、模型地址及教程地址。首页使用教程必须读取 `usageGuideUrl`。全局文档入口必须读取 `docsUrl`。价格服务必须接收所选配置的 `pricingUrl`。

Nginx 必须为两个价格代理路径配置固定上游，不再根据访问域名选择容器。
