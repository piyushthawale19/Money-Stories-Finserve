import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, TopBar } from "@/components/layout";

export const metadata: Metadata = {
    title: "Research Platform | Money Stories Finserve",
    description: "AI-powered research platform for managing and extracting insights from unstructured financial data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Sidebar />
                <main className="ml-60 min-h-screen">
                    <TopBar />
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
