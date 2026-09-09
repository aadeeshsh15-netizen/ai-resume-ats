import { API_URL } from '../config';
import { 
  ArrowRight, 
  Trash2, 
  Calendar, 
  Search, 
  Sparkles, 
  Clock,
  ShieldCheck,
  Plus
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../context/AuthContext"
import { extractApiError } from "../lib/api-errors"
import axios from "axios"

interface AnalysisItem {
  id: number
  job_title: string
  overall_score: number
  created_at: string
}

export default function HistoryPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/analyses`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAnalyses(res.data)
      } catch (err: any) {
        setError(extractApiError(err))
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [token])

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this analysis report?")) return
    try {
      await axios.delete(`${API_URL}/api/analyses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnalyses(analyses.filter(a => a.id !== id))
    } catch (err) {
      alert("Failed to delete analysis.")
    }
  }

  const handleOpen = async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/api/analyses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate("/results", { state: { matchData: res.data } })
    } catch (err) {
      alert("Failed to open report details.")
    }
  }

  const filteredAnalyses = analyses.filter(item => 
    item.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!token) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl min-h-[75vh] flex flex-col justify-center items-center text-center text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-6 shadow-lg shadow-cyan-500/10">
          <Clock className="w-8 h-8" />
        </div>
        <Badge variant="cyan" className="mb-3 font-bold uppercase tracking-wider">
          Account Required
        </Badge>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Analysis History & Cloud Sync
        </h1>
        <p className="text-slate-400 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
          Sign in to your account to automatically save your resume analyses, track ATS compatibility over time, and access previous reports.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="font-bold shadow-lg shadow-cyan-500/25">
            <Link to="/login">Sign In to View History</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-bold">
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Analysis History
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {analyses.length} {analyses.length === 1 ? 'Scan' : 'Scans'}
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Access, review, and manage your previous resume compatibility scans.
          </p>
        </div>

        <Button asChild className="font-bold self-start md:self-auto shadow-lg shadow-cyan-500/20">
          <Link to="/analyze" className="gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      {analyses.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Search by job title or role keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
          <p className="text-sm font-semibold">Loading analysis records...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-[#090d1a]/90 border-2 border-dashed border-white/10 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-2xl">
          <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mx-auto mb-5 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">No analyses recorded yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Run your first resume scan against a job description to start building your career improvement history.
          </p>
          <Button asChild size="lg" className="font-bold shadow-lg shadow-cyan-500/25">
            <Link to="/analyze">Run First Analysis <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl p-10 text-center border border-white/10 text-slate-400 text-sm">
          No records matching <span className="font-bold text-slate-200">"{searchQuery}"</span>.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAnalyses.map((analysis) => {
            const score = analysis.overall_score || 0
            const scoreColor = score >= 80 
              ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" 
              : score >= 60 
              ? "text-cyan-300 bg-cyan-500/10 border-cyan-500/30" 
              : "text-rose-300 bg-rose-500/10 border-rose-500/30"
            
            return (
              <Card 
                key={analysis.id} 
                className="overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer group bg-[#090d1a]/90 backdrop-blur-2xl border-white/10"
                onClick={() => handleOpen(analysis.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                    
                    {/* Left details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-13 w-13 rounded-2xl border flex flex-col items-center justify-center shrink-0 font-black shadow-inner ${scoreColor}`}>
                        <span className="text-lg leading-none">{score}</span>
                        <span className="text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">Score</span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                          {analysis.job_title || "Unknown Position"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Full Audit Saved
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right actions */}
                    <div className="flex items-center gap-2 sm:border-l sm:border-white/10 sm:pl-6 shrink-0 justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl" 
                        onClick={(e) => handleDelete(analysis.id, e)}
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="font-bold rounded-xl text-xs group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors"
                      >
                        View Report
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
