import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, History, Sparkles, LogOut, Menu, X, ArrowUpRight, ChevronRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { Button } from "../components/ui/button"

export default function MainLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex flex-col font-sans selection:bg-[#bbf451] selection:text-[#050505] relative overflow-x-hidden subtle-dashboard-grid">
      {/* Top Header / Dashboard Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between max-w-7xl">
          {/* Brand Monogram & Name */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-9 w-9 rounded-xl bg-[#161616] border border-[#2a2a2a] flex items-center justify-center font-black text-sm tracking-tighter text-[#f5f5f5] group-hover:border-[#bbf451]/50 group-hover:text-[#bbf451] transition-all">
                AI
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-[#f5f5f5]">
                    RESUME<span className="text-[#bbf451]">.</span>ATS
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1c1c1c] text-[#a0a0a0] border border-[#2a2a2a] px-2 py-0.5 rounded-md">
                    PRO
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Center Pill Navigation */}
            <nav className="hidden md:flex items-center p-1 bg-[#121212] border border-[#222222] rounded-2xl gap-1">
              <Link
                to="/analyze"
                className={`text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive("/analyze")
                    ? "bg-[#222222] text-[#f5f5f5] border border-[#333333] shadow-xs"
                    : "text-[#888888] hover:text-[#f5f5f5] hover:bg-[#181818]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#bbf451]" />
                <span>Analyzer</span>
              </Link>

              <Link
                to="/history"
                className={`text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive("/history")
                    ? "bg-[#222222] text-[#f5f5f5] border border-[#333333] shadow-xs"
                    : "text-[#888888] hover:text-[#f5f5f5] hover:bg-[#181818]"
                }`}
              >
                <History className="w-3.5 h-3.5 text-[#fb923c]" />
                <span>History</span>
              </Link>

              <Link
                to="/results"
                className={`text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive("/results")
                    ? "bg-[#222222] text-[#f5f5f5] border border-[#333333] shadow-xs"
                    : "text-[#888888] hover:text-[#f5f5f5] hover:bg-[#181818]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e0e0e0]" />
                <span>Diagnostics</span>
              </Link>
            </nav>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-xl">
                  <div className="h-6 w-6 rounded-lg bg-[#bbf451] text-[#050505] text-xs flex items-center justify-center font-black">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#c0c0c0] max-w-[130px] truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-[#888888] hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-[#999999] hover:text-white px-3 py-2 rounded-xl hover:bg-[#161616] transition-all"
                >
                  Sign In
                </Link>
                <Button asChild size="sm" className="font-bold text-xs uppercase tracking-wide">
                  <Link to="/analyze">
                    Launch Scan <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#050505]" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#888888] hover:text-white hover:bg-[#161616] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#222222] bg-[#0c0c0c] px-4 pt-3 pb-6 space-y-2 shadow-2xl">
            <Link
              to="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                isActive("/analyze") ? "bg-[#222222] text-[#f5f5f5] border border-[#333333]" : "text-[#888888] hover:bg-[#161616]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#bbf451]" />
                <span>Resume Analyzer</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#555555]" />
            </Link>

            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                isActive("/history") ? "bg-[#222222] text-[#f5f5f5] border border-[#333333]" : "text-[#888888] hover:bg-[#161616]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-[#fb923c]" />
                <span>Analysis History</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#555555]" />
            </Link>

            <Link
              to="/results"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                isActive("/results") ? "bg-[#222222] text-[#f5f5f5] border border-[#333333]" : "text-[#888888] hover:bg-[#161616]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Diagnostic Report</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#555555]" />
            </Link>

            <div className="pt-3 border-t border-[#1f1f1f]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#161616] border border-[#2a2a2a] rounded-xl text-xs font-semibold text-[#c0c0c0]">
                    <div className="h-5 w-5 rounded bg-[#bbf451] text-[#050505] flex items-center justify-center font-bold text-[10px]">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10 text-xs font-bold uppercase"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase">
                    <Link to="/analyze">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Structured Minimal Editorial Footer */}
      <footer className="relative z-10 border-t border-[#1a1a1a] bg-[#070707] py-12 text-[#737373]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#141414] border border-[#282828] flex items-center justify-center font-black text-xs text-[#f5f5f5]">
                  AI
                </div>
                <span className="font-extrabold text-sm uppercase tracking-wider text-[#f5f5f5]">AI RESUME ATS // INTELLIGENCE</span>
              </div>
              <p className="text-xs text-[#737373] max-w-md leading-relaxed">
                Measurable career intelligence platform with calibrated ATS compatibility algorithms, deterministic skill mapping, NLP semantic relevance, and Gemini AI coaching.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-extrabold text-[#999999] uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-[#737373]">
                <li><Link to="/analyze" className="hover:text-[#bbf451] transition-colors">Resume Matcher</Link></li>
                <li><Link to="/analyze" className="hover:text-[#bbf451] transition-colors">Job Parser</Link></li>
                <li><Link to="/history" className="hover:text-[#fb923c] transition-colors">Analysis History</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-extrabold text-[#999999] uppercase tracking-wider mb-3">Architecture</h4>
              <ul className="space-y-2 text-xs text-[#737373]">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#bbf451]"></span> TF-IDF / NLP Similarity</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#fb923c]"></span> Gemini 2.5 Flash Coaching</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white"></span> Deterministic Rule Engine</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#555555]">
            <p>© {new Date().getFullYear()} AI Resume ATS. All systems calibrated.</p>
            <div className="flex items-center space-x-5">
              <span className="hover:text-[#888888] cursor-pointer">Security Protocol</span>
              <span className="hover:text-[#888888] cursor-pointer">API Documentation</span>
              <span className="hover:text-[#888888] cursor-pointer">Privacy Matrix</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
