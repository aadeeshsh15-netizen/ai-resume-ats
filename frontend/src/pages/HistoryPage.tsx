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
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl min-h-[75vh] flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
          <Clock className="w-8 h-8" />
        </div>
        <Badge variant="default" className="mb-3 font-bold">
          ACCOUNT REQUIRED
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Analysis History & Cloud Sync
        </h1>
        <p className="text-slate-600 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
          Sign in to your free account to automatically save your resume analyses, track ATS compatibility over time, and access previous reports.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="font-bold shadow-md shadow-indigo-500/25">
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
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Analysis History
            </h1>
            <Badge variant="secondary" className="font-bold text-xs">
              {analyses.length} {analyses.length === 1 ? 'Scan' : 'Scans'}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Access, review, and manage your previous resume compatibility scans.
          </p>
        </div>

        <Button asChild className="font-bold self-start md:self-auto shadow-md shadow-indigo-500/20">
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
            className="pl-10 h-11 bg-white"
          />
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">Loading analysis records...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200/90 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-5 shadow-2xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">No analyses recorded yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Run your first resume scan against a job description to start building your career improvement history.
          </p>
          <Button asChild size="lg" className="font-bold shadow-md shadow-indigo-500/25">
            <Link to="/analyze">Run First Analysis <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500 text-sm">
          No records matching <span className="font-bold text-slate-800">"{searchQuery}"</span>.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAnalyses.map((analysis) => {
            const score = analysis.overall_score || 0
            const scoreColor = score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : score >= 60 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-rose-600 bg-rose-50 border-rose-200"
            
            return (
              <Card 
                key={analysis.id} 
                className="overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                onClick={() => handleOpen(analysis.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                    
                    {/* Left details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-13 w-13 rounded-2xl border flex flex-col items-center justify-center shrink-0 font-black shadow-2xs ${scoreColor}`}>
                        <span className="text-lg leading-none">{score}</span>
                        <span className="text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">Score</span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {analysis.job_title || "Unknown Position"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Full Audit Saved
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right actions */}
                    <div className="flex items-center gap-2 sm:border-l sm:border-slate-100 sm:pl-6 shrink-0 justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" 
                        onClick={(e) => handleDelete(analysis.id, e)}
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="font-bold rounded-xl text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors"
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
