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
      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-2xl min-h-[75vh] flex flex-col justify-center items-center text-center text-[#f5f5f5]">
        <div className="w-14 h-14 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#bbf451] mb-6 shadow-sm">
          <Clock className="w-6 h-6" />
        </div>
        <Badge variant="lime" className="mb-4 font-mono font-bold uppercase tracking-wider text-[11px]">
          Authentication Required
        </Badge>
        <h1 className="text-3xl font-extrabold text-[#f5f5f5] tracking-tight mb-3">
          Analysis History & Cloud Sync
        </h1>
        <p className="text-[#8e8e8e] mb-8 max-w-md text-sm leading-relaxed">
          Sign in to your account to automatically save your resume analyses, track ATS compatibility over time, and access previous reports.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="default" variant="default" className="font-bold px-6">
            <Link to="/login">Sign In to View History</Link>
          </Button>
          <Button asChild variant="outline" size="default" className="font-semibold px-6 border-[#262626] text-[#d4d4d4] hover:text-white">
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl text-[#f5f5f5]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f5f5]">
              Analysis History
            </h1>
            <Badge variant="secondary" className="font-mono font-bold text-xs bg-[#161616] border-[#2a2a2a] text-[#a3a3a3]">
              {analyses.length} {analyses.length === 1 ? 'Scan' : 'Scans'}
            </Badge>
          </div>
          <p className="text-[#737373] text-xs sm:text-sm mt-1">
            Access, review, and manage your previous resume compatibility scans.
          </p>
        </div>

        <Button asChild variant="default" className="font-bold self-start md:self-auto">
          <Link to="/analyze" className="gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      {analyses.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
          <Input 
            type="text"
            placeholder="Search by job title or role keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-[#111111] border-[#222222] text-[#f5f5f5] placeholder:text-[#525252] focus:border-[#bbf451]"
          />
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 text-[#737373]">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#bbf451]" />
          <p className="text-xs font-mono uppercase tracking-wider">Loading analysis records...</p>
        </div>
      ) : error ? (
        <div className="bg-[#16120e] border border-[#fb923c]/30 text-[#fb923c] p-4 rounded-xl text-xs font-medium">
          {error}
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-12 sm:p-16 text-center max-w-lg mx-auto">
          <div className="h-14 w-14 rounded-xl bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-[#bbf451] mx-auto mb-5">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#f5f5f5] mb-1.5">No analyses recorded yet</h3>
          <p className="text-xs text-[#737373] mb-6 leading-relaxed">
            Run your first resume scan against a job description to start building your career improvement history.
          </p>
          <Button asChild variant="default" className="font-bold">
            <Link to="/analyze">Run First Analysis <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="bg-[#111111] rounded-xl p-10 text-center border border-[#222222] text-[#737373] text-xs">
          No records matching <span className="font-bold text-[#f5f5f5]">"{searchQuery}"</span>.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis) => {
            const score = analysis.overall_score || 0
            const scoreStyle = score >= 75 
              ? "text-[#bbf451] bg-[#12160f] border-[#bbf451]/30" 
              : score >= 50 
              ? "text-[#fb923c] bg-[#16120e] border-[#fb923c]/30" 
              : "text-[#ef4444] bg-[#1a0f0f] border-[#ef4444]/30"
            
            return (
              <Card 
                key={analysis.id} 
                className="overflow-hidden hover:border-[#383838] transition-all cursor-pointer group bg-[#111111] border-[#222222]"
                onClick={() => handleOpen(analysis.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4">
                    
                    {/* Left details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-12 w-12 rounded-xl border flex flex-col items-center justify-center shrink-0 font-black font-mono shadow-inner ${scoreStyle}`}>
                        <span className="text-base leading-none">{score}</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">Score</span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-[#f5f5f5] group-hover:text-[#bbf451] transition-colors truncate">
                          {analysis.job_title || "Unknown Position"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#737373]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#525252]" />
                            {new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span>•</span>
                          <span className="text-[#a3a3a3] font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#bbf451]" /> Full Audit Saved
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right actions */}
                    <div className="flex items-center gap-2 sm:border-l sm:border-[#222222] sm:pl-5 shrink-0 justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[#737373] hover:text-[#fb923c] hover:bg-[#16120e] rounded-lg" 
                        onClick={(e) => handleDelete(analysis.id, e)}
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="font-semibold text-xs border-[#262626] bg-[#161616] text-[#d4d4d4] group-hover:bg-[#bbf451] group-hover:text-black group-hover:border-[#bbf451] transition-all"
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
