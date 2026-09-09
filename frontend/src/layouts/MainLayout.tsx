import { Outlet, Link, useLocation } from "react-router-dom"
import { Sparkles, History, LayoutDashboard, LogOut, Menu, X, User as UserIcon } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { Button } from "../components/ui/button"

export default function MainLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background ambient cosmic glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      </div>

      {/* Top Banner / Announcement */}
      <div className="relative z-50 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-b border-cyan-500/20 text-cyan-300 text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="text-slate-200">
          Next-Gen ATS Architecture: <span className="text-cyan-400 font-semibold">Semantic Matcher</span> & <span className="text-purple-400 font-semibold">Gemini AI Coaching</span>
        </span>
      </div>

      {/* Sticky Frosted Glass Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <div className="h-full w-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  AI Resume<span className="text-cyan-400">.</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  ATS PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">
                AI Career Co-Pilot
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/analyze"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive("/analyze")
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              Analyze
            </Link>

            <Link
              to="/history"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive("/history")
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              History
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-xl">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white text-xs flex items-center justify-center font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-300 max-w-[140px] truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Button asChild size="sm" className="font-bold">
                  <Link to="/analyze">
                    Get Started <Sparkles className="w-3.5 h-3.5 ml-1.5 text-cyan-200" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 shadow-2xl">
            <Link
              to="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/analyze") ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              Analyze Resume
            </Link>
            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/history") ? "bg-purple-500/15 text-purple-300 border border-purple-500/30" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              Analysis History
            </Link>

            <div className="pt-3 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs font-semibold text-slate-300">
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/analyze">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Modern Dark Futuristic Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#02050e] py-14 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-4 h-4 text-cyan-100" />
                </div>
                <span className="font-bold text-lg text-white">AI Resume ATS</span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Empowering job seekers with precision ATS scoring, deterministic skill mapping, NLP semantic relevance, and AI interview coaching.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/analyze" className="hover:text-cyan-400 transition-colors">Resume Matcher</Link></li>
                <li><Link to="/analyze" className="hover:text-cyan-400 transition-colors">ATS Scanner</Link></li>
                <li><Link to="/history" className="hover:text-purple-400 transition-colors">Analysis History</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Engine & Stack</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></span> Semantic Embeddings / TF-IDF</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></span> Gemini AI Coaching</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span> FastAPI + React 19 Engine</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} AI Resume Analyzer. Built for high-impact career success.</p>
            <div className="flex items-center space-x-6">
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">Privacy Policy</span>
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">Terms of Service</span>
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">Security Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
