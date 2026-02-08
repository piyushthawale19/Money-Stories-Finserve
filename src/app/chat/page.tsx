"use client";

import React, { useState, useRef, useEffect } from "react";
import { chatMessages as initialMessages } from "@/lib/data";
import { Badge, Button, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    sources?: { page: string; doc: string }[];
}

export default function ChatPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Based on my analysis of the relevant documents in your research corpus, here's what I found regarding "${input}":

**Key Findings:**
- The query matches across **3 documents** in the indexed corpus
- Most relevant source: Annual Report FY2025 (confidence: 94.2%)
- Cross-referenced with 2 additional filings for data consistency

**Summary:**
The data indicates a strong correlation between the metrics you're asking about. Revenue growth trajectories align with industry benchmarks, though operating margins show sector-specific variance of ±2.3%.

*This response was generated using hybrid retrieval (vector + BM25) across 12,847 indexed documents.*

**Note:** For compliance-critical figures, please verify against the source documents directly.`,
                timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                sources: [
                    { page: "23-27", doc: "Annual Report FY2025" },
                    { page: "8-12", doc: "Q3 Earnings Call Transcript" },
                ],
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 2500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-[calc(100vh-7rem)] animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-3 w-80" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-border pt-4 mt-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                    <h1 className="text-xl font-bold text-txt-heading">Q&A Research Chat</h1>
                    <p className="text-xs text-txt-secondary mt-0.5">Ask anything about your indexed documents • Hybrid RAG retrieval active</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="success">RAG Online</Badge>
                    <Badge>12,847 docs indexed</Badge>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 animate-slide-up",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                                AI
                            </div>
                        )}
                        <div className={cn(
                            "max-w-2xl rounded-xl px-4 py-3",
                            msg.role === "user"
                                ? "bg-brand-primary text-white rounded-br-sm"
                                : "bg-bg-surface border border-border rounded-bl-sm"
                        )}>
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.content.split("\n").map((line, j) => {
                                    // Bold text
                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                    return (
                                        <React.Fragment key={j}>
                                            {parts.map((part, k) =>
                                                part.startsWith("**") && part.endsWith("**") ? (
                                                    <strong key={k} className="font-semibold">{part.slice(2, -2)}</strong>
                                                ) : part.startsWith("*") && part.endsWith("*") ? (
                                                    <em key={k} className="text-txt-secondary italic">{part.slice(1, -1)}</em>
                                                ) : (
                                                    <span key={k}>{part}</span>
                                                )
                                            )}
                                            {j < msg.content.split("\n").length - 1 && <br />}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Sources */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border/50">
                                    <p className="text-xs text-txt-secondary mb-1.5">📎 Sources:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {msg.sources.map((src, j) => (
                                            <span key={j} className="inline-flex items-center gap-1 px-2 py-1 bg-bg-elevated rounded text-xs text-txt-secondary hover:text-brand-primary cursor-pointer transition-colors">
                                                📄 {src.doc} (p.{src.page})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className={cn(
                                "text-[10px] mt-2",
                                msg.role === "user" ? "text-white/60 text-right" : "text-txt-secondary"
                            )}>
                                {msg.timestamp}
                            </p>
                        </div>
                        {msg.role === "user" && (
                            <div className="w-8 h-8 bg-brand-accent/20 rounded-lg flex items-center justify-center text-brand-accent text-xs font-bold flex-shrink-0 mt-1">
                                P
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-3 items-start animate-fade-in">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            AI
                        </div>
                        <div className="bg-bg-surface border border-border rounded-xl px-4 py-3 rounded-bl-sm">
                            <div className="flex gap-1.5 items-center">
                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                <span className="text-xs text-txt-secondary ml-2">Searching across 12,847 documents...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-border pt-4">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question about your research documents..."
                            rows={2}
                            className="w-full bg-bg-surface border border-border rounded-xl px-4 py-3 text-sm text-txt-primary placeholder:text-txt-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all resize-none"
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-2">
                            <span className="text-[10px] text-txt-secondary">Enter to send • Shift+Enter for new line</span>
                        </div>
                    </div>
                    <Button onClick={handleSend} disabled={!input.trim() || isTyping} className="self-end h-12 w-12">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </Button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-txt-secondary hover:text-txt-primary transition-colors flex items-center gap-1">📎 Attach context</button>
                    <button className="text-xs text-txt-secondary hover:text-txt-primary transition-colors flex items-center gap-1">🏢 Scope to company</button>
                    <button className="text-xs text-txt-secondary hover:text-txt-primary transition-colors flex items-center gap-1">📊 Include charts</button>
                </div>
            </div>
        </div>
    );
}
