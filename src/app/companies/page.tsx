"use client";

import React, { useState, useEffect, useRef } from "react";
import { companies as initialCompanies } from "@/lib/data";
import { SearchInput, Badge, Button, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getPersistedCompanies, saveUserCompanies } from "@/lib/companyStore";

const SECTOR_OPTIONS = ["Conglomerate", "Banking", "Automotive", "IT Services", "NBFC", "FMCG", "Pharma", "Energy", "Telecom", "Real Estate"];
const TREND_OPTIONS: { label: string; value: "up" | "down" | "neutral" }[] = [
    { label: "📈 Up", value: "up" },
    { label: "📉 Down", value: "down" },
    { label: "➡️ Neutral", value: "neutral" },
];

export default function CompaniesPage() {
    const [search, setSearch] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [companiesList, setCompaniesList] = useState<typeof initialCompanies>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        sector: SECTOR_OPTIONS[0],
        revenue: "",
        trend: "up" as "up" | "down" | "neutral",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const modalRef = useRef<HTMLDivElement>(null);

    const sectors = ["All", ...Array.from(new Set(companiesList.map((c) => c.sector)))];

    const filtered = companiesList.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesSector = selectedSector === "All" || c.sector === selectedSector;
        return matchesSearch && matchesSector;
    });

    // Load companies from localStorage on mount with loading simulation
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            setCompaniesList(getPersistedCompanies());
            setLoading(false);
        };
        loadData();
    }, []);

    // Save companies to localStorage whenever list changes  
    useEffect(() => {
        if (companiesList.length > 0) {
            saveUserCompanies(companiesList);
        }
    }, [companiesList]);

    // Close modal on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowAddModal(false);
        };
        if (showAddModal) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [showAddModal]);

    // Close modal on outside click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setShowAddModal(false);
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = "Company name is required";
        if (companiesList.some((c) => c.name.toLowerCase() === formData.name.trim().toLowerCase()))
            errors.name = "Company already exists";
        if (!formData.revenue.trim()) errors.revenue = "Revenue is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCompany = () => {
        if (!validateForm()) return;

        const newCompany = {
            id: `user-${Date.now()}`, // Generate unique ID for user-added companies
            name: formData.name.trim(),
            sector: formData.sector,
            docs: 0,
            lastUpdated: new Date().toISOString().split("T")[0],
            trend: formData.trend,
            revenue: formData.revenue.trim(),
        };

        setCompaniesList((prev) => [newCompany, ...prev]);
        setFormData({ name: "", sector: SECTOR_OPTIONS[0], revenue: "", trend: "up" });
        setFormErrors({});
        setShowAddModal(false);
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-80" />
                    <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-24" />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-bg-surface border border-border rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <Skeleton className="w-6 h-6" />
                            </div>
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-20 mb-4" />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Skeleton className="h-3 w-16 mb-1" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                                <div>
                                    <Skeleton className="h-3 w-16 mb-1" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-5 w-12 rounded-full" />
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
                    <h1 className="text-2xl font-bold text-txt-heading">Companies</h1>
                    <p className="text-txt-secondary text-sm mt-1">Track {companiesList.length} companies across {sectors.length - 1} sectors</p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Company
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <SearchInput
                    placeholder="Search companies..."
                    value={search}
                    onChange={setSearch}
                    className="w-80"
                />
                <div className="flex gap-1 bg-bg-elevated rounded-lg p-1">
                    {sectors.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSelectedSector(s)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                selectedSector === s
                                    ? "bg-brand-primary text-white"
                                    : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Company Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((company, i) => (
                    <div
                        key={company.id}
                        className="card-3d bg-bg-surface border border-border rounded-xl p-5 cursor-pointer animate-slide-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary font-bold text-sm">
                                {company.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className={cn("text-lg", {
                                "text-brand-accent": company.trend === "up",
                                "text-brand-danger": company.trend === "down",
                                "text-txt-secondary": company.trend === "neutral",
                            })}>
                                {company.trend === "up" ? "📈" : company.trend === "down" ? "📉" : "➡️"}
                            </span>
                        </div>

                        {/* Name & sector */}
                        <h3 className="text-sm font-semibold text-txt-heading">{company.name}</h3>
                        <p className="text-xs text-txt-secondary mt-0.5">{company.sector}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                                <p className="text-[10px] text-txt-secondary uppercase tracking-wider">Documents</p>
                                <p className="text-lg font-bold text-txt-heading">{company.docs}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-txt-secondary uppercase tracking-wider">Revenue</p>
                                <p className="text-lg font-bold text-txt-heading">{company.revenue}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                            <p className="text-[10px] text-txt-secondary">Updated {company.lastUpdated}</p>
                            <Badge variant="success">Active</Badge>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-txt-secondary">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-sm">No companies found</p>
                        <p className="text-xs mt-1">Try a different search or sector filter</p>
                    </div>
                )}
            </div>

            {/* ── Add Company Modal ──────────────────────────────── */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={handleBackdropClick}
                >
                    <div
                        ref={modalRef}
                        className="w-full max-w-lg bg-bg-surface border border-border rounded-2xl shadow-2xl animate-slide-up"
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div>
                                <h2 className="text-lg font-bold text-txt-heading">Add New Company</h2>
                                <p className="text-xs text-txt-secondary mt-0.5">Fill in the details to track a new company</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                title="Close"
                                className="p-1.5 rounded-lg text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 space-y-4">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-1.5">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => { setFormData((f) => ({ ...f, name: e.target.value })); setFormErrors((fe) => ({ ...fe, name: "" })); }}
                                    placeholder="e.g. Tata Consultancy Services"
                                    className={cn(
                                        "w-full bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all",
                                        formErrors.name ? "border-brand-danger" : "border-border"
                                    )}
                                    autoFocus
                                />
                                {formErrors.name && <p className="text-xs text-brand-danger mt-1">{formErrors.name}</p>}
                            </div>

                            {/* Sector */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-1.5">Sector *</label>
                                <select
                                    value={formData.sector}
                                    onChange={(e) => setFormData((f) => ({ ...f, sector: e.target.value }))}
                                    title="Select sector"
                                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all appearance-none cursor-pointer"
                                >
                                    {SECTOR_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Revenue */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-1.5">Revenue *</label>
                                <input
                                    type="text"
                                    value={formData.revenue}
                                    onChange={(e) => { setFormData((f) => ({ ...f, revenue: e.target.value })); setFormErrors((fe) => ({ ...fe, revenue: "" })); }}
                                    placeholder="e.g. ₹2.40L Cr"
                                    className={cn(
                                        "w-full bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all",
                                        formErrors.revenue ? "border-brand-danger" : "border-border"
                                    )}
                                />
                                {formErrors.revenue && <p className="text-xs text-brand-danger mt-1">{formErrors.revenue}</p>}
                            </div>

                            {/* Trend */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-1.5">Trend</label>
                                <div className="flex gap-2">
                                    {TREND_OPTIONS.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => setFormData((f) => ({ ...f, trend: t.value }))}
                                            className={cn(
                                                "flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                                                formData.trend === t.value
                                                    ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                                                    : "border-border bg-bg-elevated text-txt-secondary hover:text-txt-primary"
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button onClick={handleAddCompany}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Company
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}