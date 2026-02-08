"use client";

import React, { useState, useEffect } from "react";
import { insights } from "@/lib/data";
import { Badge, Button, SearchInput, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

const savedInsights = [
    ...insights,
    { id: "5", title: "Reliance Jio 5G monetization ahead of schedule", description: "5G ARPU contribution reaching 18% of total wireless revenue, ahead of initial 12% target for FY25", sector: "Telecom", impact: "positive" },
    { id: "6", title: "SEBI tightening F&O regulations", description: "New margin requirements to increase trading costs by 15-20% for retail participants from Q2 2026", sector: "Regulatory", impact: "negative" },
    { id: "7", title: "Green hydrogen capex cycle beginning", description: "Combined announced investments of ₹4.2L Cr across Reliance, Adani, and NTPC for green hydrogen", sector: "Energy", impact: "positive" },
];

const collections = [
    { id: "1", name: "Q3 Earnings Analysis", count: 12, color: "#6366F1" },
    { id: "2", name: "Regulatory Updates", count: 8, color: "#EF4444" },
    { id: "3", name: "Sector Reports", count: 15, color: "#22C55E" },
    { id: "4", name: "Investment Thesis", count: 6, color: "#F59E0B" },
];

export default function SavedPage() {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"insights" | "collections">("insights");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setLoading(false);
        };
        loadData();
    }, []);

    const filtered = savedInsights.filter(
        (i) =>
            i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.description.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-28" />
                    </div>
                </div>
                <Skeleton className="h-10 w-80" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-bg-surface border border-border rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <Skeleton className="w-6 h-6 ml-4" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-txt-heading">Saved Insights</h1>
                    <p className="text-txt-secondary text-sm mt-1">Bookmarked insights and research collections</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setView("collections")}>
                        📁 Collections
                    </Button>
                    <Button onClick={() => setView("insights")}>
                        ⭐ Insights
                    </Button>
                </div>
            </div>

            <SearchInput placeholder="Search saved insights..." value={search} onChange={setSearch} className="max-w-md" />

            {view === "collections" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {collections.map((col, i) => (
                        <div
                            key={col.id}
                            className="card-3d bg-bg-surface border border-border rounded-xl p-5 cursor-pointer animate-slide-up"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: col.color + "20" }}>
                                    <span className="text-xl">📁</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-txt-heading">{col.name}</p>
                                    <p className="text-xs text-txt-secondary">{col.count} items</p>
                                </div>
                            </div>
                            <div className="h-1 rounded-full" style={{ background: col.color + "30" }}>
                                <div className="h-full rounded-full" style={{ background: col.color, width: `${(col.count / 20) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === "insights" && (
                <div className="space-y-3">
                    {filtered.map((insight, i) => (
                        <div
                            key={insight.id}
                            className="bg-bg-surface border border-border rounded-xl p-4 hover:border-brand-primary/30 transition-all cursor-pointer group animate-slide-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-2xl mt-0.5">
                                    {insight.impact === "positive" ? "📈" : insight.impact === "negative" ? "📉" : "➡️"}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-txt-heading group-hover:text-brand-primary transition-colors">
                                            {insight.title}
                                        </h3>
                                        <Badge variant={insight.impact === "positive" ? "success" : insight.impact === "negative" ? "danger" : "default"}>
                                            {insight.sector}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-txt-secondary leading-relaxed">{insight.description}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <button className="text-[10px] text-txt-secondary hover:text-brand-primary transition-colors flex items-center gap-1">
                                            📋 Copy
                                        </button>
                                        <button className="text-[10px] text-txt-secondary hover:text-brand-primary transition-colors flex items-center gap-1">
                                            📤 Share
                                        </button>
                                        <button className="text-[10px] text-txt-secondary hover:text-brand-primary transition-colors flex items-center gap-1">
                                            📑 Export PDF
                                        </button>
                                        <button className="text-[10px] text-txt-secondary hover:text-brand-danger transition-colors flex items-center gap-1">
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                                <button className="text-brand-warning text-lg hover:scale-110 transition-transform">⭐</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
