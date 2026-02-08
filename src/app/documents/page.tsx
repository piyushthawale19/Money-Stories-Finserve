"use client";

import React, { useState, useEffect, useRef } from "react";
import { recentDocuments as initialDocuments } from "@/lib/data";
import { SearchInput, Badge, Button, Tabs, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getPersistedDocuments, saveUserDocuments } from "@/lib/documentStore";

const DOCUMENT_TYPES = ["Annual Report", "Research Paper", "Filing", "Transcript", "ESG Report", "Policy", "Whitepaper", "Earnings Call"];

export default function DocumentsPage() {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("All");
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [documentsList, setDocumentsList] = useState<typeof initialDocuments>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        company: "",
        type: DOCUMENT_TYPES[0],
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tabs = ["All", "Indexed", "Processing", "Queued"];

    const filtered = documentsList.filter((d) => {
        const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.company.toLowerCase().includes(search.toLowerCase());
        const matchesTab = tab === "All" || d.status.toLowerCase() === tab.toLowerCase();
        return matchesSearch && matchesTab;
    });

    const selectedDocument = documentsList.find((d) => d.id === selectedDoc);

    // Load documents from localStorage on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setDocumentsList(getPersistedDocuments());
            setLoading(false);
        };
        loadData();
    }, []);

    // Save documents to localStorage whenever list changes
    useEffect(() => {
        if (documentsList.length > 0) {
            saveUserDocuments(documentsList);
        }
    }, [documentsList]);

    // Close modal on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowUploadModal(false);
                resetForm();
            }
        };
        if (showUploadModal) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [showUploadModal]);

    // Close modal on outside click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setShowUploadModal(false);
            resetForm();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === "application/pdf") {
                setUploadedFile(file);
                setFormErrors((fe) => ({ ...fe, file: "" }));
            } else {
                setFormErrors((fe) => ({ ...fe, file: "Only PDF files are allowed" }));
                setUploadedFile(null);
            }
        }
    };

    const resetForm = () => {
        setUploadedFile(null);
        setFormData({ company: "", type: DOCUMENT_TYPES[0] });
        setFormErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!uploadedFile) errors.file = "Please select a PDF file";
        if (!formData.company.trim()) errors.company = "Company name is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpload = () => {
        if (!validateForm() || !uploadedFile) return;

        // Simulate file processing
        const newDocument = {
            id: `user-${Date.now()}`,
            title: uploadedFile.name.replace(".pdf", ""),
            company: formData.company.trim(),
            type: formData.type,
            date: new Date().toISOString().split("T")[0],
            pages: Math.floor(Math.random() * 150) + 10, // Random page count for demo
            status: "processing" as const,
        };

        setDocumentsList((prev) => [newDocument, ...prev]);
        setShowUploadModal(false);
        resetForm();

        // Simulate processing completion after 3 seconds
        setTimeout(() => {
            setDocumentsList((prev) =>
                prev.map((doc) =>
                    doc.id === newDocument.id ? { ...doc, status: "indexed" as const } : doc
                )
            );
        }, 3000);
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
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-20" />
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 h-[calc(100vh-16rem)]">
                    <div className="w-1/2 bg-bg-surface border border-border rounded-xl p-4 space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="p-4 border-b border-border/50 last:border-0">
                                <div className="flex items-start justify-between mb-2">
                                    <Skeleton className="h-5 w-64" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 bg-bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center justify-center h-full">
                            <Skeleton className="h-48 w-48 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-txt-heading">Documents</h1>
                    <p className="text-txt-secondary text-sm mt-1">{documentsList.length} documents across all sources</p>
                </div>
                <Button onClick={() => setShowUploadModal(true)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload PDF
                </Button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <SearchInput placeholder="Search documents..." value={search} onChange={setSearch} className="w-80" />
                <Tabs tabs={tabs} active={tab} onChange={setTab} />
            </div>

            {/* Split view */}
            <div className="flex gap-4 h-[calc(100vh-16rem)]">
                {/* Document list */}
                <div className="w-1/2 bg-bg-surface border border-border rounded-xl overflow-y-auto">
                    {filtered.map((doc, i) => (
                        <div
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc.id)}
                            className={cn(
                                "flex items-start gap-3 px-4 py-3.5 border-b border-border/50 cursor-pointer transition-all animate-slide-up",
                                selectedDoc === doc.id
                                    ? "bg-brand-primary/5 border-l-2 border-l-brand-primary"
                                    : "hover:bg-bg-elevated/50"
                            )}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className="w-10 h-12 bg-bg-elevated rounded flex items-center justify-center text-xl flex-shrink-0">
                                📄
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-txt-heading truncate">{doc.title}</p>
                                <p className="text-xs text-txt-secondary mt-0.5">{doc.company} • {doc.pages} pages</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Badge variant={doc.status === "indexed" ? "success" : doc.status === "processing" ? "processing" : "warning"}>
                                        {doc.status}
                                    </Badge>
                                    <span className="text-[10px] text-txt-secondary">{doc.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Document preview */}
                <div className="w-1/2 bg-bg-surface border border-border rounded-xl overflow-y-auto">
                    {selectedDocument ? (
                        <div className="animate-fade-in">
                            {/* Preview header */}
                            <div className="sticky top-0 glass border-b border-border px-5 py-4">
                                <h3 className="text-sm font-semibold text-txt-heading">{selectedDocument.title}</h3>
                                <p className="text-xs text-txt-secondary mt-0.5">{selectedDocument.company} • {selectedDocument.type}</p>
                            </div>

                            {/* Simulated PDF viewer */}
                            <div className="p-5">
                                <div className="bg-bg-elevated rounded-lg p-6 border border-border">
                                    {/* Mock PDF content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                            <span className="text-xs text-txt-secondary">Page 1 of {selectedDocument.pages}</span>
                                            <div className="flex gap-2">
                                                <button className="p-1 text-txt-secondary hover:text-txt-primary transition-colors">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </button>
                                                <button className="p-1 text-txt-secondary hover:text-txt-primary transition-colors">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Simulated document text with highlights */}
                                        <div className="space-y-3 text-sm text-txt-secondary leading-relaxed">
                                            <h2 className="text-lg font-bold text-txt-heading">Executive Summary</h2>
                                            <p>
                                                The financial year 2024-25 has been a transformative period for the organization, marked by{" "}
                                                <span className="bg-brand-warning/20 text-brand-warning px-1 rounded">strong revenue growth of 14.2% year-over-year</span>,
                                                driven primarily by the digital services and retail segments.
                                            </p>
                                            <p>
                                                Consolidated EBITDA margins improved by 180 basis points to 18.6%, reflecting{" "}
                                                <span className="bg-brand-accent/20 text-brand-accent px-1 rounded">operational efficiency improvements</span>{" "}
                                                across all business verticals. The O2C business maintained robust refining margins at{" "}
                                                <span className="bg-brand-primary/20 text-brand-primary px-1 rounded">$12.4 per barrel</span>,
                                                significantly above the industry average.
                                            </p>
                                            <p>
                                                Capital expenditure for the year stood at ₹1,42,000 Cr, with a significant portion allocated
                                                towards 5G network expansion, retail store rollouts, and green energy initiatives. The company
                                                remains committed to achieving net-zero carbon emissions by 2035.
                                            </p>
                                            <h3 className="text-base font-semibold text-txt-heading mt-4">Key Financial Highlights</h3>
                                            <div className="bg-bg-surface rounded-lg p-3 border border-border/50">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="text-txt-secondary">
                                                            <th className="text-left py-1.5">Metric</th>
                                                            <th className="text-right py-1.5">FY25</th>
                                                            <th className="text-right py-1.5">FY24</th>
                                                            <th className="text-right py-1.5">YoY</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-txt-primary">
                                                        <tr className="border-t border-border/30">
                                                            <td className="py-1.5">Revenue</td>
                                                            <td className="text-right font-mono">₹9,74,250 Cr</td>
                                                            <td className="text-right font-mono">₹8,53,100 Cr</td>
                                                            <td className="text-right text-brand-accent font-mono">+14.2%</td>
                                                        </tr>
                                                        <tr className="border-t border-border/30">
                                                            <td className="py-1.5">EBITDA</td>
                                                            <td className="text-right font-mono">₹1,81,210 Cr</td>
                                                            <td className="text-right font-mono">₹1,43,620 Cr</td>
                                                            <td className="text-right text-brand-accent font-mono">+26.2%</td>
                                                        </tr>
                                                        <tr className="border-t border-border/30">
                                                            <td className="py-1.5">Net Profit</td>
                                                            <td className="text-right font-mono">₹79,512 Cr</td>
                                                            <td className="text-right font-mono">₹65,010 Cr</td>
                                                            <td className="text-right text-brand-accent font-mono">+22.3%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata sidebar */}
                                <div className="mt-4 bg-bg-elevated rounded-lg p-4 border border-border/50">
                                    <h4 className="text-xs font-semibold text-txt-heading mb-3">Document Metadata</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <p className="text-txt-secondary">Type</p>
                                            <p className="text-txt-primary font-medium">{selectedDocument.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-txt-secondary">Pages</p>
                                            <p className="text-txt-primary font-medium">{selectedDocument.pages}</p>
                                        </div>
                                        <div>
                                            <p className="text-txt-secondary">Chunks</p>
                                            <p className="text-txt-primary font-medium font-mono">{selectedDocument.pages * 3}</p>
                                        </div>
                                        <div>
                                            <p className="text-txt-secondary">Indexed</p>
                                            <p className="text-txt-primary font-medium">{selectedDocument.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-txt-secondary">Entities Found</p>
                                            <p className="text-txt-primary font-medium">24</p>
                                        </div>
                                        <div>
                                            <p className="text-txt-secondary">OCR Confidence</p>
                                            <p className="text-txt-primary font-medium text-brand-accent">98.4%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-txt-secondary">
                            <div className="text-5xl mb-4">📑</div>
                            <p className="text-sm">Select a document to preview</p>
                            <p className="text-xs mt-1">Click any document on the left to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Upload PDF Modal ──────────────────────────────── */}
            {showUploadModal && (
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
                                <h2 className="text-lg font-bold text-txt-heading">Upload PDF Document</h2>
                                <p className="text-xs text-txt-secondary mt-0.5">Upload and index a new document</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    resetForm();
                                }}
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
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-2">PDF File *</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label
                                    htmlFor="pdf-upload"
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all",
                                        formErrors.file
                                            ? "border-brand-danger bg-brand-danger/5"
                                            : uploadedFile
                                                ? "border-brand-primary bg-brand-primary/5"
                                                : "border-border bg-bg-elevated hover:bg-bg-surface hover:border-brand-primary/50"
                                    )}
                                >
                                    {uploadedFile ? (
                                        <div className="flex flex-col items-center">
                                            <svg className="w-10 h-10 text-brand-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm font-medium text-txt-heading">{uploadedFile.name}</p>
                                            <p className="text-xs text-txt-secondary mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <svg className="w-10 h-10 text-txt-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-sm text-txt-primary">Click to upload PDF</p>
                                            <p className="text-xs text-txt-secondary mt-1">or drag and drop</p>
                                        </div>
                                    )}
                                </label>
                                {formErrors.file && <p className="text-xs text-brand-danger mt-1">{formErrors.file}</p>}
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-1.5">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => {
                                        setFormData((f) => ({ ...f, company: e.target.value }));
                                        setFormErrors((fe) => ({ ...fe, company: "" }));
                                    }}
                                    placeholder="e.g. Reliance Industries"
                                    className={cn(
                                        "w-full bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all",
                                        formErrors.company ? "border-brand-danger" : "border-border"
                                    )}
                                />
                                {formErrors.company && <p className="text-xs text-brand-danger mt-1">{formErrors.company}</p>}
                            </div>

                            {/* Document Type */}
                            <div>
                                <label className="block text-sm font-medium text-txt-heading mb-1.5">Document Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                                    title="Select document type"
                                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all appearance-none cursor-pointer"
                                >
                                    {DOCUMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowUploadModal(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleUpload}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload Document
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
