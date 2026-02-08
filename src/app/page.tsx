"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { StatCard, Badge, Skeleton } from "@/components/ui";
import { pipelineStats, recentDocuments, sectorDistribution, monthlyIngestion, queryVolume, insights } from "@/lib/data";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(t);
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-txt-heading">Dashboard</h1>
                <p className="text-txt-secondary text-sm mt-1">Overview of your research pipeline and insights</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Documents"
                    value={pipelineStats.totalDocs.toLocaleString()}
                    subtitle={`${pipelineStats.totalPages.toLocaleString()} pages`}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    trend="up"
                    trendValue="12.3% this month"
                />
                <StatCard
                    title="Indexed"
                    value={pipelineStats.indexed.toLocaleString()}
                    subtitle={`${((pipelineStats.indexed / pipelineStats.totalDocs) * 100).toFixed(1)}% of total`}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    trend="up"
                    trendValue="8.7% this week"
                />
                <StatCard
                    title="Processing"
                    value={pipelineStats.processing}
                    subtitle="In pipeline now"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                    trend="neutral"
                    trendValue="Avg 4.2s/doc"
                />
                <StatCard
                    title="Companies Tracked"
                    value={pipelineStats.totalCompanies.toLocaleString()}
                    subtitle="Across 14 sectors"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    trend="up"
                    trendValue="+42 this month"
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Monthly ingestion */}
                <div className="lg:col-span-2 bg-bg-surface border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-txt-heading mb-4">Monthly Document Ingestion</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={monthlyIngestion}>
                            <defs>
                                <linearGradient id="gradDocs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#E5E7EB", fontSize: "12px" }}
                            />
                            <Area type="monotone" dataKey="docs" stroke="#6366F1" strokeWidth={2} fill="url(#gradDocs)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Sector distribution */}
                <div className="bg-bg-surface border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-txt-heading mb-4">Sector Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={sectorDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} strokeWidth={2} stroke="#0B1220">
                                {sectorDistribution.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#E5E7EB", fontSize: "12px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {sectorDistribution.slice(0, 4).map((s) => (
                            <div key={s.name} className="flex items-center gap-1.5 text-xs text-txt-secondary">
                                <span className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                                {s.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Query volume + insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Query volume */}
                <div className="bg-bg-surface border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-txt-heading mb-4">Weekly Query Volume</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={queryVolume}>
                            <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#E5E7EB", fontSize: "12px" }}
                            />
                            <Bar dataKey="queries" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Insights */}
                <div className="lg:col-span-2 bg-bg-surface border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-txt-heading mb-4">AI-Generated Insights</h3>
                    <div className="space-y-3">
                        {insights.map((insight) => (
                            <div key={insight.id} className="flex items-start gap-3 p-3 bg-bg-elevated/50 rounded-lg hover:bg-bg-elevated transition-all cursor-pointer group">
                                <span className="text-lg mt-0.5">
                                    {insight.impact === "positive" ? "📈" : insight.impact === "negative" ? "📉" : "➡️"}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-txt-heading group-hover:text-brand-primary transition-colors">{insight.title}</p>
                                    <p className="text-xs text-txt-secondary mt-0.5">{insight.description}</p>
                                </div>
                                <Badge variant={insight.impact === "positive" ? "success" : insight.impact === "negative" ? "danger" : "default"}>
                                    {insight.sector}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent documents */}
            <div className="bg-bg-surface border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-txt-heading">Recent Documents</h3>
                    <a href="/documents" className="text-xs text-brand-primary hover:underline">View all →</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-txt-secondary text-xs border-b border-border">
                                <th className="text-left py-3 px-3 font-medium">Document</th>
                                <th className="text-left py-3 px-3 font-medium">Company</th>
                                <th className="text-left py-3 px-3 font-medium">Type</th>
                                <th className="text-left py-3 px-3 font-medium">Pages</th>
                                <th className="text-left py-3 px-3 font-medium">Date</th>
                                <th className="text-left py-3 px-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDocuments.map((doc) => (
                                <tr key={doc.id} className="border-b border-border/50 hover:bg-bg-elevated/50 transition-colors cursor-pointer">
                                    <td className="py-3 px-3">
                                        <p className="text-txt-heading font-medium truncate max-w-xs">{doc.title}</p>
                                    </td>
                                    <td className="py-3 px-3 text-txt-secondary">{doc.company}</td>
                                    <td className="py-3 px-3"><Badge>{doc.type}</Badge></td>
                                    <td className="py-3 px-3 text-txt-secondary font-mono">{doc.pages}</td>
                                    <td className="py-3 px-3 text-txt-secondary">{doc.date}</td>
                                    <td className="py-3 px-3">
                                        <Badge variant={doc.status === "indexed" ? "success" : doc.status === "processing" ? "processing" : "warning"}>
                                            {doc.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
        </div>
    );
}
