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
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Next-Gen Semantic ATS Matching Engine with Deep NLP Insights</span>
      </div>

      {/* Sticky Frosted Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  AI Resume<span className="text-indigo-600">.</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/70 px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">
                ATS & Career Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/analyze"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive("/analyze")
                  ? "bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              Analyze
            </Link>

            <Link
              to="/history"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive("/history")
                  ? "bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <History className="w-4 h-4 text-violet-500" />
              History
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-xs flex items-center justify-center font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[140px] truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100/70 transition-all"
                >
                  Sign In
                </Link>
                <Button asChild size="sm" className="font-bold">
                  <Link to="/analyze">
                    Get Started <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <Link
              to="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/analyze") ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              Analyze Resume
            </Link>
            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/history") ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <History className="w-4 h-4 text-violet-500" />
              Analysis History
            </Link>

            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
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
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 text-slate-600">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-slate-900">AI Resume Analyzer</span>
              </div>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                Empowering job seekers with precision ATS scoring, deterministic skill mapping, NLP semantic relevance, and AI interview coaching.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/analyze" className="hover:text-indigo-600 transition-colors">Resume Matcher</Link></li>
                <li><Link to="/analyze" className="hover:text-indigo-600 transition-colors">ATS Scanner</Link></li>
                <li><Link to="/history" className="hover:text-indigo-600 transition-colors">Analysis History</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Technology</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Sentence Transformers</li>
                <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Gemini AI Engine</li>
                <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span> FastAPI + React 19</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} AI Resume Analyzer. Built for high-impact career success.</p>
            <div className="flex items-center space-x-6">
              <span className="text-slate-400">Privacy Policy</span>
              <span className="text-slate-400">Terms of Service</span>
              <span className="text-slate-400">Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
