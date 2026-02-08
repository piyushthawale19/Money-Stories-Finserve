// Mock data for the Research Platform

export const recentDocuments = [
  {
    id: "1",
    title: "Q3 2025 Annual Report - Reliance Industries",
    company: "Reliance",
    type: "Annual Report",
    date: "2025-12-15",
    pages: 142,
    status: "indexed",
  },
  {
    id: "2",
    title: "Industry Analysis - Indian Fintech Landscape",
    company: "Sector Report",
    type: "Research Paper",
    date: "2025-11-28",
    pages: 67,
    status: "indexed",
  },
  {
    id: "3",
    title: "SEBI Circular - New Margin Requirements",
    company: "Regulatory",
    type: "Filing",
    date: "2025-12-01",
    pages: 23,
    status: "indexed",
  },
  {
    id: "4",
    title: "Tata Motors - EV Strategy Deep Dive",
    company: "Tata Motors",
    type: "Research Paper",
    date: "2025-11-10",
    pages: 89,
    status: "processing",
  },
  {
    id: "5",
    title: "HDFC Bank Q2 Earnings Call Transcript",
    company: "HDFC Bank",
    type: "Transcript",
    date: "2025-10-25",
    pages: 34,
    status: "indexed",
  },
  {
    id: "6",
    title: "Infosys Annual ESG Report 2025",
    company: "Infosys",
    type: "ESG Report",
    date: "2025-09-30",
    pages: 210,
    status: "indexed",
  },
  {
    id: "7",
    title: "RBI Monetary Policy Statement - Dec 2025",
    company: "Regulatory",
    type: "Policy",
    date: "2025-12-06",
    pages: 18,
    status: "indexed",
  },
  {
    id: "8",
    title: "Wipro Digital Transformation Whitepaper",
    company: "Wipro",
    type: "Whitepaper",
    date: "2025-10-15",
    pages: 45,
    status: "queued",
  },
];

export const companies = [
  {
    id: "1",
    name: "Reliance Industries",
    sector: "Conglomerate",
    docs: 342,
    lastUpdated: "2025-12-15",
    trend: "up",
    revenue: "₹9.74L Cr",
  },
  {
    id: "2",
    name: "HDFC Bank",
    sector: "Banking",
    docs: 218,
    lastUpdated: "2025-10-25",
    trend: "up",
    revenue: "₹2.85L Cr",
  },
  {
    id: "3",
    name: "Tata Motors",
    sector: "Automotive",
    docs: 156,
    lastUpdated: "2025-11-10",
    trend: "up",
    revenue: "₹3.46L Cr",
  },
  {
    id: "4",
    name: "Infosys",
    sector: "IT Services",
    docs: 289,
    lastUpdated: "2025-09-30",
    trend: "down",
    revenue: "₹1.62L Cr",
  },
  {
    id: "5",
    name: "Wipro",
    sector: "IT Services",
    docs: 134,
    lastUpdated: "2025-10-15",
    trend: "neutral",
    revenue: "₹0.90L Cr",
  },
  {
    id: "6",
    name: "Bajaj Finance",
    sector: "NBFC",
    docs: 98,
    lastUpdated: "2025-08-20",
    trend: "up",
    revenue: "₹0.52L Cr",
  },
  {
    id: "7",
    name: "SBI",
    sector: "Banking",
    docs: 267,
    lastUpdated: "2025-11-05",
    trend: "up",
    revenue: "₹6.10L Cr",
  },
  {
    id: "8",
    name: "ITC Limited",
    sector: "FMCG",
    docs: 178,
    lastUpdated: "2025-09-12",
    trend: "neutral",
    revenue: "₹0.70L Cr",
  },
];

export const pipelineStats = {
  totalDocs: 12847,
  indexed: 11932,
  processing: 456,
  queued: 312,
  failed: 147,
  totalPages: 1082000,
  totalCompanies: 1024,
  avgProcessingTime: "4.2s",
};

export const sectorDistribution = [
  { name: "Banking", value: 28, fill: "#6366F1" },
  { name: "IT Services", value: 22, fill: "#8B5CF6" },
  { name: "Pharma", value: 14, fill: "#22C55E" },
  { name: "Auto", value: 12, fill: "#F59E0B" },
  { name: "FMCG", value: 10, fill: "#EF4444" },
  { name: "Energy", value: 8, fill: "#06B6D4" },
  { name: "Others", value: 6, fill: "#9CA3AF" },
];

export const monthlyIngestion = [
  { month: "Jul", docs: 1200, pages: 89000 },
  { month: "Aug", docs: 1450, pages: 102000 },
  { month: "Sep", docs: 1680, pages: 118000 },
  { month: "Oct", docs: 1890, pages: 134000 },
  { month: "Nov", docs: 2100, pages: 156000 },
  { month: "Dec", docs: 2340, pages: 172000 },
  { month: "Jan", docs: 2580, pages: 189000 },
];

export const queryVolume = [
  { day: "Mon", queries: 520 },
  { day: "Tue", queries: 680 },
  { day: "Wed", queries: 590 },
  { day: "Thu", queries: 720 },
  { day: "Fri", queries: 610 },
  { day: "Sat", queries: 180 },
  { day: "Sun", queries: 120 },
];

export const chatMessages = [
  {
    id: "1",
    role: "user" as const,
    content: "What are the key highlights from Reliance Q3 2025 annual report?",
    timestamp: "10:23 AM",
  },
  {
    id: "2",
    role: "assistant" as const,
    content: `Based on the **Reliance Industries Q3 2025 Annual Report**, here are the key highlights:

**Revenue & Profitability:**
- Consolidated revenue grew **14.2% YoY** to ₹2,43,500 Cr
- EBITDA margin expanded by **180 bps** to 18.6%
- Net profit stood at ₹19,878 Cr, up **22.3% YoY**

**Jio Platforms:**
- Subscriber base crossed **489 million** users
- ARPU improved to ₹203.3/month (+8.2% YoY)
- 5G rollout completed across **95% of urban India**

**Retail:**
- Store count reached **18,946** across 7,000+ towns
- Digital commerce revenue grew **42% YoY**

**O2C Business:**
- Refining margins at **$12.4/bbl** vs industry avg of $6.8
- Commenced operations of MJ1 unit at Jamnagar

*Source: Pages 12-18, 45-52, 89-94 of the Annual Report*`,
    timestamp: "10:23 AM",
    sources: [
      { page: "12-18", doc: "Q3 2025 Annual Report" },
      { page: "45-52", doc: "Q3 2025 Annual Report" },
      { page: "89-94", doc: "Q3 2025 Annual Report" },
    ],
  },
  {
    id: "3",
    role: "user" as const,
    content: "How does their 5G strategy compare with Bharti Airtel's?",
    timestamp: "10:25 AM",
  },
  {
    id: "4",
    role: "assistant" as const,
    content: `**Comparative 5G Strategy Analysis: Jio vs Airtel**

| Metric | Jio | Airtel |
|--------|-----|--------|
| Coverage | 95% urban India | 82% urban India |
| Technology | SA (Standalone) | NSA (Non-Standalone) |
| Spectrum Spent | ₹88,078 Cr | ₹43,084 Cr |
| Avg Speed | 600 Mbps | 350 Mbps |
| Enterprise Focus | Medium | High |

**Key Differences:**
1. **Architecture:** Jio is betting on Standalone 5G for lower latency, while Airtel uses Non-Standalone leveraging existing 4G infrastructure — a system-level tradeoff between future-proofing and faster deployment.
2. **Enterprise:** Airtel has a stronger enterprise play with dedicated private 5G networks for 140+ enterprises.
3. **Consumer:** Jio leads in consumer adoption due to aggressive pricing and bundled JioFiber plans.

*Sources: Reliance Annual Report p.34-38, Airtel Q2 Earnings Deck p.12-16*`,
    timestamp: "10:26 AM",
    sources: [
      { page: "34-38", doc: "Reliance Annual Report" },
      { page: "12-16", doc: "Airtel Q2 Earnings Deck" },
    ],
  },
];

export const adminJobs = [
  {
    id: "J-1001",
    doc: "HDFC Bank Annual Report 2025",
    status: "completed",
    startedAt: "10:15 AM",
    duration: "3.2s",
    chunks: 428,
    errors: 0,
  },
  {
    id: "J-1002",
    doc: "Tata Motors EV Strategy",
    status: "processing",
    startedAt: "10:18 AM",
    duration: "—",
    chunks: 0,
    errors: 0,
  },
  {
    id: "J-1003",
    doc: "Bajaj Finance Q3 Results",
    status: "queued",
    startedAt: "—",
    duration: "—",
    chunks: 0,
    errors: 0,
  },
  {
    id: "J-1004",
    doc: "SBI Credit Report Oct 2025",
    status: "failed",
    startedAt: "10:12 AM",
    duration: "1.1s",
    chunks: 0,
    errors: 3,
  },
  {
    id: "J-1005",
    doc: "ITC FMCG Strategy Document",
    status: "completed",
    startedAt: "10:08 AM",
    duration: "5.7s",
    chunks: 612,
    errors: 0,
  },
  {
    id: "J-1006",
    doc: "SEBI Circular Draft",
    status: "completed",
    startedAt: "10:05 AM",
    duration: "1.4s",
    chunks: 87,
    errors: 0,
  },
];

export const insights = [
  {
    id: "1",
    title: "Banking Sector NPA ratios declining",
    description:
      "Gross NPA ratio across top 10 banks dropped to 3.2% from 4.1% YoY",
    sector: "Banking",
    impact: "positive",
  },
  {
    id: "2",
    title: "IT sector headcount flat YoY",
    description:
      "Combined headcount of TCS, Infosys, Wipro, HCL remained flat at 15.2L",
    sector: "IT Services",
    impact: "neutral",
  },
  {
    id: "3",
    title: "EV adoption accelerating in India",
    description:
      "EV penetration crossed 6.2% in Q3 2025, up from 3.8% in Q3 2024",
    sector: "Automotive",
    impact: "positive",
  },
  {
    id: "4",
    title: "Pharma margin pressure from API costs",
    description:
      "API import costs up 18% due to China supply chain disruptions",
    sector: "Pharma",
    impact: "negative",
  },
];

export const notifications = [
  {
    id: "1",
    title: "Document Processing Complete",
    message: "HDFC Bank Annual Report 2025 has been indexed successfully",
    time: "5 min ago",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "New Company Added",
    message: "Tata Motors has been added to your tracking list",
    time: "1 hour ago",
    type: "info",
    read: false,
  },
  {
    id: "3",
    title: "Processing Failed",
    message: "SBI Credit Report Oct 2025 failed to process. Retrying...",
    time: "2 hours ago",
    type: "error",
    read: true,
  },
  {
    id: "4",
    title: "Query Volume Alert",
    message: "Daily query limit reached 80%. Consider upgrading.",
    time: "3 hours ago",
    type: "warning",
    read: true,
  },
  {
    id: "5",
    title: "System Update",
    message: "Platform maintenance scheduled for tonight at 2 AM IST",
    time: "5 hours ago",
    type: "info",
    read: true,
  },
];
