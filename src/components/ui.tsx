"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Stat Card ───────────────────────────────────────────
interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, trendValue, className }: StatCardProps) {
    return (
        <div className={cn(
            "card-3d bg-bg-surface border border-border rounded-xl p-5 transition-all duration-300",
            className
        )}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-txt-secondary text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-txt-heading mt-1">{value}</p>
                    {subtitle && <p className="text-txt-secondary text-xs mt-1">{subtitle}</p>}
                    {trend && trendValue && (
                        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", {
                            "text-brand-accent": trend === "up",
                            "text-brand-danger": trend === "down",
                            "text-txt-secondary": trend === "neutral",
                        })}>
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                        </div>
                    )}
                </div>
                <div className="p-2.5 bg-brand-primary/10 rounded-lg text-brand-primary">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// ─── Badge ────────────────────────────────────────────────
interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "danger" | "processing";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
            {
                "bg-brand-primary/15 text-brand-primary": variant === "default",
                "bg-brand-accent/15 text-brand-accent": variant === "success",
                "bg-brand-warning/15 text-brand-warning": variant === "warning",
                "bg-brand-danger/15 text-brand-danger": variant === "danger",
                "bg-blue-500/15 text-blue-400": variant === "processing",
            }
        )}>
            {variant === "processing" && (
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            )}
            {variant === "success" && (
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
            )}
            {children}
        </span>
    );
}

// ─── Skeleton ─────────────────────────────────────────────
interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={cn("skeleton rounded-lg", className)} />;
}

// ─── Search Input ─────────────────────────────────────────
interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
    className?: string;
}

export function SearchInput({ placeholder = "Search...", value, onChange, className }: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
            />
        </div>
    );
}

// ─── Button ───────────────────────────────────────────────
interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function Button({ children, variant = "primary", size = "md", onClick, className, disabled }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.97]",
                {
                    "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20": variant === "primary",
                    "bg-bg-elevated hover:bg-border text-txt-primary border border-border": variant === "secondary",
                    "hover:bg-bg-elevated text-txt-secondary hover:text-txt-primary": variant === "ghost",
                    "bg-brand-danger hover:bg-brand-danger/90 text-white": variant === "danger",
                    "px-3 py-1.5 text-xs": size === "sm",
                    "px-4 py-2 text-sm": size === "md",
                    "px-6 py-3 text-base": size === "lg",
                    "opacity-50 cursor-not-allowed": disabled,
                },
                className
            )}
        >
            {children}
        </button>
    );
}

// ─── Empty Pill Tabs ──────────────────────────────────────
interface TabsProps {
    tabs: string[];
    active: string;
    onChange: (tab: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
    return (
        <div className="flex gap-1 bg-bg-elevated rounded-lg p-1">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                        active === tab
                            ? "bg-brand-primary text-white shadow-sm"
                            : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
