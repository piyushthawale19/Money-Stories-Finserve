"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { companies, recentDocuments, notifications as initialNotifications } from "@/lib/data";
import { getPersistedCompanies } from "@/lib/companyStore";
import { getPersistedDocuments } from "@/lib/documentStore";

const navItems = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/companies", label: "Companies", icon: "🏢" },
    { href: "/documents", label: "Documents", icon: "📄" },
    { href: "/chat", label: "Q&A Chat", icon: "💬" },
    { href: "/saved", label: "Saved Insights", icon: "⭐" },
    { href: "/admin", label: "Admin", icon: "🔧" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-bg-surface border-r border-border flex flex-col transition-all duration-300 z-50",
            collapsed ? "w-16" : "w-60"
        )}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    RP
                </div>
                {!collapsed && (
                    <div className="animate-fade-in">
                        <h1 className="text-sm font-bold text-txt-heading">Research Platform</h1>
                        <p className="text-[10px] text-txt-secondary">by Money Stories</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-brand-primary/10 text-brand-primary glow-primary"
                                    : "text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated"
                            )}>
                                <span className="text-base flex-shrink-0">{item.icon}</span>
                                {!collapsed && (
                                    <span className="animate-fade-in">{item.label}</span>
                                )}
                                {isActive && !collapsed && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse_slow" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="border-t border-border p-3">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-txt-secondary hover:text-txt-primary text-sm rounded-lg hover:bg-bg-elevated transition-all"
                >
                    <span>{collapsed ? "→" : "←"}</span>
                    {!collapsed && <span>Collapse</span>}
                </button>
            </div>
        </aside>
    );
}

export function TopBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [companiesList, setCompaniesList] = useState(companies);
    const [documentsList, setDocumentsList] = useState(recentDocuments);
    const [notificationsList, setNotificationsList] = useState(initialNotifications);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const showDropdown = isFocused && searchQuery.trim().length > 0;
    const unreadCount = notificationsList.filter(n => !n.read).length;

    // Load persisted data on mount
    useEffect(() => {
        setCompaniesList(getPersistedCompanies());
        setDocumentsList(getPersistedDocuments());
    }, []);

    // Search results
    const matchedCompanies = searchQuery.trim()
        ? companiesList.filter((c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.sector.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    const matchedDocuments = searchQuery.trim()
        ? documentsList.filter((d) =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.type.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    const hasResults = matchedCompanies.length > 0 || matchedDocuments.length > 0;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Keyboard shortcut: Ctrl/Cmd + K
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                setIsFocused(false);
                setShowNotifications(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const handleNavigate = (path: string) => {
        setSearchQuery("");
        setIsFocused(false);
        router.push(path);
    };

    const markAsRead = (notifId: string) => {
        setNotificationsList((prev) =>
            prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotificationsList([]);
    };

    return (
        <header className="sticky top-0 z-40 glass border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div ref={searchRef} className="relative max-w-xl w-full">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-secondary z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search documents, companies, insights..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        className={cn(
                            "w-full bg-bg-elevated/50 border border-border rounded-xl pl-10 pr-16 py-2 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all",
                            showDropdown && "rounded-b-none border-b-0"
                        )}
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-txt-secondary bg-bg-surface px-1.5 py-0.5 rounded border border-border">⌘K</kbd>

                    {/* Search Results Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-bg-surface border border-border border-t-0 rounded-b-xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-[420px] overflow-y-auto">
                            {!hasResults && (
                                <div className="px-4 py-8 text-center text-txt-secondary">
                                    <div className="text-3xl mb-2">🔍</div>
                                    <p className="text-sm">No results for &quot;{searchQuery}&quot;</p>
                                    <p className="text-xs mt-1">Try different keywords</p>
                                </div>
                            )}

                            {/* Companies Results */}
                            {matchedCompanies.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 bg-bg-elevated/50 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-txt-secondary uppercase tracking-wider">Companies</span>
                                        <span className="text-[10px] text-txt-secondary">{matchedCompanies.length} found</span>
                                    </div>
                                    {matchedCompanies.map((company) => (
                                        <button
                                            key={company.id}
                                            onClick={() => handleNavigate("/companies")}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-elevated/70 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary font-bold text-xs flex-shrink-0">
                                                {company.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-txt-heading truncate group-hover:text-brand-primary transition-colors">
                                                    {company.name}
                                                </p>
                                                <p className="text-xs text-txt-secondary">{company.sector} • {company.revenue}</p>
                                            </div>
                                            <span className={cn("text-xs", {
                                                "text-brand-accent": company.trend === "up",
                                                "text-brand-danger": company.trend === "down",
                                                "text-txt-secondary": company.trend === "neutral",
                                            })}>
                                                {company.trend === "up" ? "📈" : company.trend === "down" ? "📉" : "➡️"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Documents Results */}
                            {matchedDocuments.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 bg-bg-elevated/50 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-txt-secondary uppercase tracking-wider">Documents</span>
                                        <span className="text-[10px] text-txt-secondary">{matchedDocuments.length} found</span>
                                    </div>
                                    {matchedDocuments.map((doc) => (
                                        <button
                                            key={doc.id}
                                            onClick={() => handleNavigate("/documents")}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-elevated/70 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 bg-bg-elevated rounded-lg flex items-center justify-center text-base flex-shrink-0">
                                                📄
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-txt-heading truncate group-hover:text-brand-primary transition-colors">
                                                    {doc.title}
                                                </p>
                                                <p className="text-xs text-txt-secondary">{doc.company} • {doc.type} • {doc.pages} pages</p>
                                            </div>
                                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", {
                                                "bg-brand-accent/15 text-brand-accent": doc.status === "indexed",
                                                "bg-blue-500/15 text-blue-400": doc.status === "processing",
                                                "bg-brand-warning/15 text-brand-warning": doc.status === "queued",
                                            })}>
                                                {doc.status}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            {hasResults && (
                                <div className="px-4 py-2.5 bg-bg-elevated/30 border-t border-border/50 flex items-center justify-between">
                                    <span className="text-[10px] text-txt-secondary">
                                        {matchedCompanies.length + matchedDocuments.length} results
                                    </span>
                                    <span className="text-[10px] text-txt-secondary flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-bg-surface rounded border border-border text-[9px]">↵</kbd> to navigate
                                        <kbd className="px-1 py-0.5 bg-bg-surface rounded border border-border text-[9px] ml-1">esc</kbd> to close
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                    <button
                        title="Notifications"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-txt-secondary hover:text-txt-primary rounded-lg hover:bg-bg-elevated transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-danger rounded-full animate-pulse" />
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-96 bg-bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                            {/* Header */}
                            <div className="px-4 py-3 bg-bg-elevated/50 border-b border-border flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-txt-heading">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <p className="text-xs text-txt-secondary mt-0.5">{unreadCount} unread</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    {notificationsList.length > 0 && (
                                        <button
                                            onClick={clearAll}
                                            title="Clear all"
                                            className="p-1 text-txt-secondary hover:text-brand-danger transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-[420px] overflow-y-auto">
                                {notificationsList.length === 0 ? (
                                    <div className="px-4 py-12 text-center text-txt-secondary">
                                        <div className="text-4xl mb-2">🔔</div>
                                        <p className="text-sm">No notifications</p>
                                        <p className="text-xs mt-1">You're all caught up!</p>
                                    </div>
                                ) : (
                                    notificationsList.map((notif) => (
                                        <button
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className={cn(
                                                "w-full flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-bg-elevated/70 transition-all text-left",
                                                !notif.read && "bg-brand-primary/5"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                                                    notif.type === "success" && "bg-brand-accent/15 text-brand-accent",
                                                    notif.type === "error" && "bg-brand-danger/15 text-brand-danger",
                                                    notif.type === "warning" && "bg-brand-warning/15 text-brand-warning",
                                                    notif.type === "info" && "bg-blue-500/15 text-blue-400"
                                                )}
                                            >
                                                {notif.type === "success" && "✓"}
                                                {notif.type === "error" && "✕"}
                                                {notif.type === "warning" && "⚠"}
                                                {notif.type === "info" && "ℹ"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium text-txt-heading truncate">
                                                        {notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-txt-secondary mt-0.5 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-txt-secondary mt-1">{notif.time}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notificationsList.length > 0 && (
                                <div className="px-4 py-2.5 bg-bg-elevated/30 border-t border-border/50 text-center">
                                    <button className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium transition-colors">
                                        View all notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-brand-primary/50 transition-all">
                    P
                </div>
            </div>
        </header>
    );
}
