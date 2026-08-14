export type ProviderPricingItem = {
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

export type ProviderPricingResult = {
    data: ProviderPricingItem[];
    group_ratio: Record<string, number>;
};

export async function fetchProviderPricing(url: string): Promise<ProviderPricingResult> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`获取价格失败：${response.statusText}`);
    const json = (await response.json()) as { data?: ProviderPricingItem[]; group_ratio?: Record<string, number> };
    return {
        data: json.data ?? [],
        group_ratio: json.group_ratio ?? {},
    };
}
