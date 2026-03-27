import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Market Pulse | Financial Intelligence",
  description: "Real-time market impact analysis and OSINT financial dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-slate-200 antialiased`}>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Top Navbar */}
          <nav className="h-14 border-b border-border bg-panel flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-info rounded flex items-center justify-center font-bold text-white">M</div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                MARKET PULSE
              </span>
            </div>
            
            <div className="flex-1 max-w-2xl px-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="SEARCH EVENTS, ASSETS, REGIONS..." 
                  className="w-full bg-background border border-border px-4 py-1.5 rounded text-sm focus:outline-none focus:border-info transition-colors uppercase tracking-wider font-medium placeholder:text-slate-600"
                />
                <div className="absolute right-3 top-2 text-slate-600 text-[10px] font-mono">/ CMD + K</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Live UTC Time</span>
                <span className="text-sm font-mono tracking-wider tabular-nums">22:23:33</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-border bg-slate-800 flex items-center justify-center cursor-pointer hover:border-info transition-colors">
                <div className="w-4 h-4 rounded-full border-t-2 border-info"></div>
              </div>
            </div>
          </nav>
          
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
