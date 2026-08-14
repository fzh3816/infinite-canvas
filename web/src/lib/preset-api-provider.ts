type PresetApiProvider = {
    domains: string[];
    id: string;
    name: string;
    channelPrefix: string;
    baseUrl: string;
    pricingUrl: string;
    setupGuideUrl: string;
    usageGuideUrl: string;
    docsUrl: string;
};

export const presetApiProviders: Record<string, PresetApiProvider> = {
    lingyun: {
        domains: ["lingyunapi.com"],
        id: "lingyun",
        name: "灵云",
        channelPrefix: "lingyun",
        baseUrl: "https://image.lingyunapi.com",
        pricingUrl: "/proxy/lingyun-pricing",
        setupGuideUrl: "https://b2wm53yf7h.apifox.cn/9200514m0",
        usageGuideUrl: "https://b2wm53yf7h.apifox.cn/9200522m0",
        docsUrl: "https://b2wm53yf7h.apifox.cn/9200514m0",
    },
    nuona: {
        domains: ["nuona.vin"],
        id: "nuona",
        name: "Nuona",
        channelPrefix: "nuona",
        baseUrl: "https://api.nuona.vin",
        pricingUrl: "/proxy/nuona-pricing",
        setupGuideUrl: "https://aaa.com",
        usageGuideUrl: "https://aaa.com",
        docsUrl: "https://aaa.com",
    },
};

const hostname = window.location.hostname.toLowerCase();

export const presetApiProvider = Object.values(presetApiProviders).find((provider) => provider.domains.some((domain) => hostname.includes(domain))) ?? presetApiProviders.lingyun;
