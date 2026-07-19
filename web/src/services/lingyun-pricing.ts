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

export type LingyunPricingResult = {
    data: LingyunPricingItem[];
    group_ratio: Record<string, number>;
};

export async function fetchLingyunPricing(): Promise<LingyunPricingResult> {
    const response = await fetch("/proxy/lingyun-pricing");
    if (!response.ok) throw new Error(`获取价格失败：${response.statusText}`);
    const json = (await response.json()) as { data?: LingyunPricingItem[]; group_ratio?: Record<string, number> };
    return {
        data: json.data ?? [],
        group_ratio: json.group_ratio ?? {},
    };
}
