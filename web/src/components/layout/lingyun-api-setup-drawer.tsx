import { App, Button, Drawer, Form, Input, Modal, Spin, Table } from "antd";
import { ExternalLink, DollarSign } from "lucide-react";
import { useState } from "react";

import { fetchChannelModels } from "@/services/api/image";
import { fetchLingyunPricing, type LingyunPricingItem } from "@/services/lingyun-pricing";
import { createModelChannel, guessCapability, type ModelChannel } from "@/stores/use-config-store";

const LINGYUN_BASE_URL = "https://image.lingyunapi.com";

const LINGYUN_LINKS = [
    { label: "配置教程", url: "https://b2wm53yf7h.apifox.cn/9200514m0" },
    { label: "使用教程", url: "https://b2wm53yf7h.apifox.cn/9200522m0" },
];

function PricingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { message } = App.useApp();
    const [data, setData] = useState<LingyunPricingItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const load = async () => {
        if (data.length) return;
        setLoading(true);
        try {
            setData(await fetchLingyunPricing());
        } catch (error) {
            message.error(error instanceof Error ? error.message : "获取价格失败");
        } finally {
            setLoading(false);
        }
    };

    const imageModels = data.filter((item) => (item.tags ?? "").includes("画图"));
    const visible = search.trim()
        ? imageModels.filter((item) => item.model_name.toLowerCase().includes(search.toLowerCase()))
        : imageModels;

    const columns = [
        {
            title: "模型名称",
            dataIndex: "model_name",
            key: "model_name",
            width: 250,
            render: (name: string) => <span className="font-mono text-xs">{name}</span>,
        },
        {
            title: "价格（元/次）",
            key: "price",
            width: 130,
            render: (_: unknown, row: LingyunPricingItem) => (
                <span className="font-mono text-xs">&yen;{row.model_price}</span>
            ),
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
            render: (desc: string) => <span className="text-xs text-stone-500">{desc ?? "—"}</span>,
        },
    ];

    return (
        <Modal
            title="灵云 API 生图模型价格"
            open={open}
            width={860}
            onCancel={onClose}
            footer={null}
            afterOpenChange={(o) => { if (o) void load(); }}
            styles={{ body: { maxHeight: "68vh", overflowY: "auto" } }}
        >
            <div className="mb-3">
                <Input.Search placeholder="搜索模型名称…" value={search} onChange={(e) => setSearch(e.target.value)} allowClear />
            </div>
            <Spin spinning={loading}>
                <Table
                    dataSource={visible}
                    columns={columns}
                    rowKey="model_name"
                    size="small"
                    pagination={{ pageSize: 20, showSizeChanger: false }}
                />
            </Spin>
        </Modal>
    );
}

export function LingyunApiSetupDrawer({ open, onSetup, onClose }: { open: boolean; onSetup: (channels: ModelChannel[]) => { added: number; updated: number }; onClose: () => void }) {
    const { message } = App.useApp();
    const [imageKey, setImageKey] = useState("");
    const [codexKey, setCodexKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [pricingOpen, setPricingOpen] = useState(false);

    const handleClose = () => {
        setImageKey("");
        setCodexKey("");
        onClose();
    };

    const handleConfirm = async () => {
        if (!imageKey.trim()) {
            message.error("请输入灵云API 画图分组密钥【生图】");
            return;
        }
        setLoading(true);
        try {
            const imageChannelTemp = createModelChannel({ baseUrl: LINGYUN_BASE_URL, apiKey: imageKey.trim(), apiFormat: "openai" });
            const allImageModelNames = await fetchChannelModels(imageChannelTemp);

            const geminiNames = allImageModelNames.filter((n) => n.toLowerCase().includes("gemini"));
            const gptImageNames = allImageModelNames.filter((n) => {
                const lower = n.toLowerCase();
                return lower.includes("gpt-image") || lower.includes("dall-e") || lower.includes("imagen") || lower.includes("flux");
            });

            const allTextModelNames = codexKey.trim()
                ? (await fetchChannelModels(createModelChannel({ baseUrl: LINGYUN_BASE_URL, apiKey: codexKey.trim(), apiFormat: "openai" }))).filter((n) => guessCapability(n) === "text")
                : [];

            const newChannels: ModelChannel[] = [];

            if (geminiNames.length) {
                newChannels.push(
                    createModelChannel({
                        name: "lingyun-gemini生图",
                        baseUrl: LINGYUN_BASE_URL,
                        apiKey: imageKey.trim(),
                        apiFormat: "gemini",
                        models: geminiNames.map((n) => ({ name: n, capability: "image" as const })),
                    }),
                );
            }

            if (gptImageNames.length) {
                newChannels.push(
                    createModelChannel({
                        name: "lingyun-gpt生图",
                        baseUrl: LINGYUN_BASE_URL,
                        apiKey: imageKey.trim(),
                        apiFormat: "openai",
                        models: gptImageNames.map((n) => ({ name: n, capability: "image" as const })),
                    }),
                );
            }

            if (allTextModelNames.length) {
                newChannels.push(
                    createModelChannel({
                        name: "lingyun-codex文本",
                        baseUrl: LINGYUN_BASE_URL,
                        apiKey: codexKey.trim(),
                        apiFormat: "openai",
                        models: allTextModelNames.map((n) => ({ name: n, capability: "text" as const })),
                    }),
                );
            }

            if (!newChannels.length) {
                message.warning("未获取到可用模型，请检查密钥是否正确");
                return;
            }

            const { added, updated } = onSetup(newChannels);
            handleClose();
            message.success(`配置完成：新增 ${added} 个渠道，更新 ${updated} 个渠道`);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "配置失败，请检查密钥是否正确");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Drawer open={open} width={480} title="一键配置灵云 API 渠道" onClose={handleClose} footer={null}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3">
                        {LINGYUN_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                            >
                                <ExternalLink className="size-3.5" />
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={() => setPricingOpen(true)}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                            <DollarSign className="size-3.5" />
                            {"模型价格"}
                        </button>
                    </div>
                    <Form layout="vertical" requiredMark={false}>
                        <Form.Item label="生图模型密钥" extra="用于创建 Gemini 生图和 GPT 生图两个渠道" className="mb-4">
                            <Input.Password value={imageKey} onChange={(e) => setImageKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
                        </Form.Item>
                        <Form.Item label="Codex 对话模型密钥（选填）" extra="用于创建文本对话渠道，不填则跳过" className="mb-4">
                            <Input.Password value={codexKey} onChange={(e) => setCodexKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
                        </Form.Item>
                        <Button type="primary" block loading={loading} onClick={() => void handleConfirm()}>
                            {loading ? "正在获取模型并配置渠道..." : "确认配置"}
                        </Button>
                    </Form>
                </div>
            </Drawer>
            <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
        </>
    );
}
