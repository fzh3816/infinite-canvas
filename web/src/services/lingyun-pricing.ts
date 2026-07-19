export type LingyunPricingItem = {
    model_name: string;
    description?: string;
    tags?: string;
    quota_type: 0 | 1;
    model_ratio: number;
    model_price: number;
    completion_ratio: number;
    cache_ratio?: number;
    enable_groups: string[];
    supported_endpoint_types: string[];
};

export async function fetchLingyunPricing(): Promise<LingyunPricingItem[]> {
    const response = await fetch("https://www.lingyunapi.com/api/pricing");
    if (!response.ok) throw new Error(`获取价格失败：${response.statusText}`);
    const json = (await response.json()) as { data?: LingyunPricingItem[] };
    return json.data ?? [];
}
