"use client";

import React, { useState, useEffect } from "react";
import { adminJobs, pipelineStats } from "@/lib/data";
import { StatCard, Badge, Button, Tabs, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("Pipeline");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-bg-surface border border-border rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="w-8 h-8 rounded-lg" />
                            </div>
                            <Skeleton className="h-8 w-20 mb-2" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4 mb-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-24" />
                    ))}
                </div>
                <div className="bg-bg-surface border border-border rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border">
                                <tr>
                                    {[...Array(7)].map((_, i) => (
                                        <th key={i} className="px-6 py-4">
                                            <Skeleton className="h-4 w-20" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-border/50 last:border-0">
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <Skeleton className="h-4 w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-txt-heading">Admin Console</h1>
                    <p className="text-txt-secondary text-sm mt-1">Pipeline monitoring, job management, and system controls</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reprocess All Failed
                    </Button>
                    <Button variant="danger">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Queue
                    </Button>
                </div>
            </div>

            {/* Pipeline stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Total Documents"
                    value={pipelineStats.totalDocs.toLocaleString()}
                    icon={<span className="text-xl">📄</span>}
                />
                <StatCard
                    title="Indexed"
                    value={pipelineStats.indexed.toLocaleString()}
                    icon={<span className="text-xl">✅</span>}
                    trend="up"
                    trendValue="98.2%"
                />
                <StatCard
                    title="Processing"
                    value={pipelineStats.processing}
                    icon={<span className="text-xl">⚙️</span>}
                />
                <StatCard
                    title="In Queue"
                    value={pipelineStats.queued}
                    icon={<span className="text-xl">📋</span>}
                />
                <StatCard
                    title="Failed"
                    value={pipelineStats.failed}
                    icon={<span className="text-xl">❌</span>}
                    trend="down"
                    trendValue="1.1%"
                />
            </div>

            {/* Tabs */}
            <Tabs tabs={["Pipeline", "Jobs", "System"]} active={tab} onChange={setTab} />

            {/* Pipeline tab */}
            {tab === "Pipeline" && (
                <div className="space-y-4">
                    {/* Pipeline visualization */}
                    <div className="bg-bg-surface border border-border rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-txt-heading mb-4">Processing Pipeline Status</h3>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {[
                                { name: "Ingestion", count: 24, status: "active", icon: "📥" },
                                { name: "OCR/Parse", count: 18, status: "active", icon: "🔍" },
                                { name: "Chunking", count: 12, status: "active", icon: "✂️" },
                                { name: "Metadata", count: 8, status: "active", icon: "🏷️" },
                                { name: "Embedding", count: 15, status: "active", icon: "🧮" },
                                { name: "Indexing", count: 6, status: "active", icon: "📇" },
                            ].map((stage, i) => (
                                <React.Fragment key={stage.name}>
                                    <div className="flex flex-col items-center gap-2 min-w-[100px]">
                                        <div className={cn(
                                            "w-16 h-16 rounded-xl flex items-center justify-center text-2xl border-2 transition-all",
                                            stage.status === "active"
                                                ? "border-brand-primary bg-brand-primary/10 glow-primary"
                                                : "border-border bg-bg-elevated"
                                        )}>
                                            {stage.icon}
                                        </div>
                                        <p className="text-xs font-medium text-txt-heading">{stage.name}</p>
                                        <Badge variant="processing">{stage.count} active</Badge>
                                    </div>
                                    {i < 5 && (
                                        <div className="flex-shrink-0 text-brand-primary animate-pulse">
                                            →
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Processing speed metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-bg-surface border border-border rounded-xl p-5">
                            <p className="text-xs text-txt-secondary mb-1">Avg Processing Time</p>
                            <p className="text-3xl font-bold text-txt-heading font-mono">4.2<span className="text-sm text-txt-secondary">s</span></p>
                            <div className="mt-3 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-brand-accent rounded-full" style={{ width: "78%" }} />
                            </div>
                            <p className="text-[10px] text-txt-secondary mt-1">Target: &lt;5s per document</p>
                        </div>
                        <div className="bg-bg-surface border border-border rounded-xl p-5">
                            <p className="text-xs text-txt-secondary mb-1">OCR Accuracy</p>
                            <p className="text-3xl font-bold text-txt-heading font-mono">96.8<span className="text-sm text-txt-secondary">%</span></p>
                            <div className="mt-3 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-brand-primary rounded-full" style={{ width: "96.8%" }} />
                            </div>
                            <p className="text-[10px] text-txt-secondary mt-1">Target: &gt;95%</p>
                        </div>
                        <div className="bg-bg-surface border border-border rounded-xl p-5">
                            <p className="text-xs text-txt-secondary mb-1">Queue Health</p>
                            <p className="text-3xl font-bold text-brand-accent font-mono">Healthy</p>
                            <div className="mt-3 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-brand-accent rounded-full" style={{ width: "92%" }} />
                            </div>
                            <p className="text-[10px] text-txt-secondary mt-1">312 queued • 0 stalled</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Jobs tab */}
            {tab === "Jobs" && (
                <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-txt-secondary text-xs border-b border-border bg-bg-elevated/50">
                                <th className="text-left py-3 px-4 font-medium">Job ID</th>
                                <th className="text-left py-3 px-4 font-medium">Document</th>
                                <th className="text-left py-3 px-4 font-medium">Status</th>
                                <th className="text-left py-3 px-4 font-medium">Started</th>
                                <th className="text-left py-3 px-4 font-medium">Duration</th>
                                <th className="text-left py-3 px-4 font-medium">Chunks</th>
                                <th className="text-left py-3 px-4 font-medium">Errors</th>
                                <th className="text-left py-3 px-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminJobs.map((job) => (
                                <tr key={job.id} className="border-b border-border/50 hover:bg-bg-elevated/30 transition-colors">
                                    <td className="py-3 px-4 font-mono text-xs text-brand-primary">{job.id}</td>
                                    <td className="py-3 px-4 text-txt-heading font-medium">{job.doc}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant={
                                            job.status === "completed" ? "success" :
                                                job.status === "processing" ? "processing" :
                                                    job.status === "failed" ? "danger" : "warning"
                                        }>
                                            {job.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-txt-secondary text-xs">{job.startedAt}</td>
                                    <td className="py-3 px-4 font-mono text-xs">{job.duration}</td>
                                    <td className="py-3 px-4 font-mono text-xs">{job.chunks || "—"}</td>
                                    <td className="py-3 px-4">
                                        {job.errors > 0 ? (
                                            <span className="text-brand-danger font-mono text-xs">{job.errors}</span>
                                        ) : (
                                            <span className="text-txt-secondary text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {job.status === "failed" && (
                                            <Button size="sm" variant="secondary">Retry</Button>
                                        )}
                                        {job.status === "completed" && (
                                            <Button size="sm" variant="ghost">View</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* System tab */}
            {tab === "System" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-bg-surface border border-border rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-txt-heading mb-4">System Resources</h3>
                        <div className="space-y-4">
                            {[
                                { name: "CPU Usage", value: 42, max: 100, unit: "%" },
                                { name: "Memory", value: 12.4, max: 32, unit: "GB" },
                                { name: "Storage", value: 2970, max: 5000, unit: "GB" },
                                { name: "Vector DB", value: 48, max: 128, unit: "GB" },
                            ].map((r) => (
                                <div key={r.name}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-txt-secondary">{r.name}</span>
                                        <span className="text-txt-primary font-mono">{r.value}{r.unit} / {r.max}{r.unit}</span>
                                    </div>
                                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", {
                                                "bg-brand-accent": (r.value / r.max) < 0.7,
                                                "bg-brand-warning": (r.value / r.max) >= 0.7 && (r.value / r.max) < 0.9,
                                                "bg-brand-danger": (r.value / r.max) >= 0.9,
                                            })}
                                            style={{ width: `${(r.value / r.max) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-bg-surface border border-border rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-txt-heading mb-4">Service Health</h3>
                        <div className="space-y-3">
                            {[
                                { name: "API Server (Fastify)", status: "healthy", latency: "12ms" },
                                { name: "PostgreSQL", status: "healthy", latency: "3ms" },
                                { name: "Redis Queue", status: "healthy", latency: "1ms" },
                                { name: "Qdrant Vector DB", status: "healthy", latency: "8ms" },
                                { name: "Elasticsearch", status: "healthy", latency: "15ms" },
                                { name: "OCR Workers (x3)", status: "healthy", latency: "—" },
                                { name: "Embedding Workers (x2)", status: "healthy", latency: "—" },
                            ].map((s) => (
                                <div key={s.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("w-2 h-2 rounded-full", {
                                            "bg-brand-accent": s.status === "healthy",
                                            "bg-brand-warning": s.status === "degraded",
                                            "bg-brand-danger": s.status === "down",
                                        })} />
                                        <span className="text-sm text-txt-primary">{s.name}</span>
                                    </div>
                                    <span className="text-xs font-mono text-txt-secondary">{s.latency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
