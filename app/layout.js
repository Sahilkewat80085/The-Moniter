import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import LiveClock from "../components/LiveClock";
import StockTicker from "../components/StockTicker";
import IndianStockTicker from "../components/IndianStockTicker";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "The Monitor | Financial Intelligence & OSINT Matrix",
  description: "Real-time geopolitical event mapping, algorithmic sentiment analysis, and multi-market financial surveillance.",
  keywords: ["OSINT", "Financial Intelligence", "Geopolitical Analysis", "Market Monitor", "3D Globe", "Real-Time News"],
  authors: [{ name: "The Monitor" }],
  icons: {
    icon: "/logo.jpg",
  },
};

export const viewport = {
  themeColor: "#0b0f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-info/30 selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex flex-col h-screen overflow-hidden">
            {/* Top Command Navbar */}
            <header className="h-14 border-b border-border bg-panel/90 backdrop-blur-md flex items-center justify-between px-6 z-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 relative overflow-hidden rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] border border-white/10 group cursor-pointer hover:border-info/50 transition-all duration-300">
                  <Image 
                    src="/logo.jpg" 
                    alt="The Monitor Logo" 
                    width={36}
                    height={36}
                    priority
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-blue-400 via-slate-200 to-slate-400 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase italic leading-none">
                    The Monitor
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                    OSINT Command Matrix
                  </span>
                </div>
              </div>
              
              <div className="flex-1 max-w-xl px-8 hidden md:block">
                <div className="relative">
                  <input 
                    type="search" 
                    placeholder="SEARCH EVENTS, ASSETS, REGIONS..." 
                    aria-label="Search events, assets, regions"
                    className="w-full bg-background/80 border border-border px-4 py-1.5 rounded-md text-xs focus:outline-none focus:border-info focus:ring-1 focus:ring-info/50 transition-all uppercase tracking-wider font-medium placeholder:text-slate-500 dark:placeholder:text-slate-600"
                  />
                  <div className="absolute right-3 top-2 text-slate-500 dark:text-slate-600 text-[9px] font-mono pointer-events-none">
                    ⌘K
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <LiveClock />
                <ThemeToggle />
                <div 
                  className="w-8 h-8 rounded-full border border-border bg-panel flex items-center justify-center cursor-pointer hover:border-info transition-colors"
                  title="System Status: Operational"
                  aria-label="System status"
                >
                  <div className="w-2 h-2 rounded-full bg-positive animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              </div>
            </header>
            
            <main className="flex-1 overflow-hidden relative pb-16">
              {children}
            </main>
            
            <IndianStockTicker />
            <StockTicker />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
