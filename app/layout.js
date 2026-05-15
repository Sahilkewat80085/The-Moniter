import "./globals.css";
import { Inter } from "next/font/google";
import LiveClock from "../components/LiveClock";
import StockTicker from "../components/StockTicker.js";
import IndianStockTicker from "../components/IndianStockTicker.js";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Monitor | Financial Intelligence",
  description: "Real-time market impact analysis and OSINT financial dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex flex-col h-screen overflow-hidden">
            {/* Top Navbar */}
            <nav className="h-14 border-b border-border bg-panel flex items-center justify-between px-6 z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative overflow-hidden rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-white/10 group cursor-pointer hover:border-info/50 transition-all duration-300">
                  <img 
                    src="/logo.jpg" 
                    alt="The Monitor Logo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                </div>
                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-slate-400 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase italic">
                  The Monitor
                </span>
              </div>
              
              <div className="flex-1 max-w-2xl px-8">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="SEARCH EVENTS, ASSETS, REGIONS..." 
                    className="w-full bg-background border border-border px-4 py-1.5 rounded text-sm focus:outline-none focus:border-info transition-colors uppercase tracking-wider font-medium placeholder:text-slate-500 dark:placeholder:text-slate-600"
                  />
                  <div className="absolute right-3 top-2 text-slate-500 dark:text-slate-600 text-[10px] font-mono">/ CMD + K</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <LiveClock />
                <ThemeToggle />
                <div className="w-8 h-8 rounded-full border border-border bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:border-info transition-colors">
                  <div className="w-4 h-4 rounded-full border-t-2 border-info"></div>
                </div>
              </div>
            </nav>
            
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
