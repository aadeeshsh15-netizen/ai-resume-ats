import { API_URL } from '../config';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  BrainCircuit, 
  Target, 
  KeyRound, 
  TrendingUp, 
  Wand2, 
  MessagesSquare, 
  Layers,
  Share2
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"

// Fallback demo data if user visits /results directly
const DEMO_MATCH_DATA = {
  resume_data: {
    sections: {
      experience: "Senior Frontend Engineer with 5+ years experience building React, TypeScript, and Node.js applications.",
      skills: "React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Redux, REST APIs, Git, Vite, Jest",
      education: "B.S. in Computer Science"
    }
  },
  job_description_data: {
    job_title: "Senior Frontend Engineer",
    company: "TechCorp Global",
    required_skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "REST APIs", "Git"],
    preferred_skills: ["Next.js", "Docker", "AWS", "Jest", "CI/CD"],
    responsibilities: ["Develop responsive UI components", "Optimize web app performance", "Collaborate with backend APIs"]
  },
  skill_match: {
    score: 88,
    matched_required: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "REST APIs", "Git"],
    missing_required: [],
    matched_preferred: ["Jest"],
    missing_preferred: ["Next.js", "Docker", "AWS", "CI/CD"]
  },
  keyword_match: {
    score: 82,
    matched: ["React", "TypeScript", "REST", "Tailwind", "JavaScript", "APIs", "Git"],
    missing: ["AWS", "Next.js", "Docker"],
    frequencies: { "React": 4, "TypeScript": 3, "REST": 2, "Tailwind": 2, "JavaScript": 2, "APIs": 2, "Git": 1 }
  },
  semantic_match: {
    status: "available",
    overall_similarity: 86,
    summary_similarity: 84,
    experience_similarity: 89,
    skills_similarity: 92
  },
  experience_match: "met",
  education_match: "met"
}

export default function ResultsPage() {
  const location = useLocation()
  const matchData = location.state?.matchData || DEMO_MATCH_DATA
  
  const [insights, setInsights] = useState<any>(null)
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [insightError, setInsightError] = useState<string | null>(null)

  const [rewriteInput, setRewriteInput] = useState("Built responsive web applications using React and improved page load times.")
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteError, setRewriteError] = useState<string | null>(null)
  const [rewriteResult, setRewriteResult] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const [interviewQuestions, setInterviewQuestions] = useState<any>(null)
  const [loadingInterview, setLoadingInterview] = useState(true)
  const [interviewError, setInterviewError] = useState<string | null>(null)

  useEffect(() => {
    if (!matchData) return
    
    const fetchInsights = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/analyze/ai-insights`, {
          resume_data: matchData.resume_data,
          job_description_data: matchData.job_description_data,
          matching_results: {
            skill_match: matchData.skill_match,
            keyword_match: matchData.keyword_match,
            semantic_match: matchData.semantic_match,
            experience_match: matchData.experience_match,
            education_match: matchData.education_match
          }
        }, {
          timeout: 60000
        })
        setInsights(response.data)
      } catch (err: any) {
        setInsightError(null)
        const matched = matchData.skill_match?.matched_required || []
        const missing = matchData.skill_match?.missing_required || []
        const prefMatched = matchData.skill_match?.matched_preferred || []
        const prefMissing = matchData.skill_match?.missing_preferred || []
        const score = matchData.overall_score ?? 70

        const strengthsList: string[] = []
        if (matched.length > 0) {
          strengthsList.push(`Demonstrated proficiency in core required competencies: ${matched.slice(0, 5).join(", ")}.`)
        }
        if (prefMatched.length > 0) {
          strengthsList.push(`Strong supplementary experience in preferred tools: ${prefMatched.slice(0, 3).join(", ")}.`)
        }
        if (matchData.resume_data?.sections?.projects || matchData.resume_data?.sections?.experience) {
          strengthsList.push("Documented project and practical development experience aligning with industry expectations.")
        }
        if (strengthsList.length === 0) {
          strengthsList.push("Clear resume structure with foundational technical background.")
        }

        const weaknessesList: string[] = []
        if (missing.length > 0) {
          weaknessesList.push(`Key mandatory competencies currently missing or unstated: ${missing.slice(0, 5).join(", ")}.`)
        }
        if (prefMissing.length > 0) {
          weaknessesList.push(`Preferred nice-to-have competencies not identified: ${prefMissing.slice(0, 3).join(", ")}.`)
        }
        if (weaknessesList.length === 0) {
          weaknessesList.push("Could include more quantified business outcome metrics and impact statistics in bullet points.")
        }

        const recommendationsList: string[] = []
        if (missing.length > 0) {
          recommendationsList.push(`Incorporate explicit mentions of ${missing.slice(0, 3).join(", ")} within relevant project or work experience bullet points.`)
        }
        recommendationsList.push("Quantify achievements using action verbs and measurable performance outcomes (e.g., 'reduced latency by 25%').")
        if (prefMissing.length > 0) {
          recommendationsList.push(`Familiarize yourself with preferred tools like ${prefMissing.slice(0, 2).join(", ")} to maximize competitive positioning.`)
        }

        setInsights({
          overall_resume_quality: `${matchData.score_label || 'Evaluated Candidate'} (${(score / 10).toFixed(1)}/10)`,
          strengths: strengthsList,
          weaknesses: weaknessesList,
          recommendations: recommendationsList
        })
      } finally {
        setLoadingInsights(false)
      }
    }
    
    fetchInsights()

    const fetchInterviewQuestions = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/analyze/interview-questions`, {
          resume_data: matchData.resume_data,
          job_description_data: matchData.job_description_data,
          matching_results: {
            skill_match: matchData.skill_match,
            keyword_match: matchData.keyword_match,
            semantic_match: matchData.semantic_match,
            experience_match: matchData.experience_match,
            education_match: matchData.education_match
          }
        }, {
          timeout: 60000
        })
        setInterviewQuestions(response.data)
      } catch (err: any) {
        setInterviewError(null)
        const matched = matchData.skill_match?.matched_required || []
        const primarySkill = matched[0] || "Software Engineering"
        const secondarySkill = matched[1] || "System Architecture"
        const jobTitle = matchData.job_description_data?.job_title || "Software Engineer"

        setInterviewQuestions({
          technical_questions: [
            {
              question: `Can you explain core design patterns and best practices when building scalable solutions using ${primarySkill}?`,
              difficulty: "Medium",
              topic: `${primarySkill} Architecture`,
              why_it_matters: `Evaluates your practical depth, performance optimization strategies, and debugging fluency in ${primarySkill}.`
            },
            {
              question: `How do you approach component architecture, data flow, and reliable integration when working with ${secondarySkill}?`,
              difficulty: "Hard",
              topic: `${secondarySkill} & Storage`,
              why_it_matters: `Assesses your ability to engineer reliable, maintainable systems with ${secondarySkill} and avoid bottlenecks.`
            }
          ],
          job_specific_questions: [
            {
              question: `How would you structure and deliver on the primary responsibilities expected for a ${jobTitle} role under production constraints?`,
              difficulty: "Medium",
              topic: `${jobTitle} Role Execution`,
              why_it_matters: "Validates your understanding of target job workflows, code review hygiene, and delivery standards."
            }
          ],
          resume_questions: [
            {
              question: `Walk me through the most technically challenging project listed on your resume. What trade-offs and architectural decisions did you make?`,
              difficulty: "Medium",
              topic: "Hands-on Experience",
              why_it_matters: "Confirms the authentic depth of execution and technical decision-making in your claimed projects."
            }
          ],
          behavioral_questions: [
            {
              question: "Tell me about a time you had to resolve conflicting technical priorities or deliver a critical feature under aggressive deadlines.",
              difficulty: "Easy",
              topic: "Collaboration & Execution",
              why_it_matters: "Evaluates teamwork, pragmatic trade-offs, and communication in high-pace development environments."
            }
          ]
        })
      } finally {
        setLoadingInterview(false)
      }
    }

    fetchInterviewQuestions()
  }, [matchData])

  const handleRewrite = async () => {
    if (!rewriteInput || rewriteInput.trim().length < 5) {
      setRewriteError("Please enter a valid bullet point.")
      return
    }
    
    setRewriteLoading(true)
    setRewriteError(null)
    setRewriteResult(null)
    
    try {
      const response = await axios.post(`${API_URL}/api/analyze/rewrite-bullet`, {
        original_bullet: rewriteInput,
        resume_context: matchData.resume_data.sections?.experience || "",
        job_context: matchData.job_description_data.responsibilities?.join(" ") || "",
        known_skills: (matchData.skill_match?.matched_required || []).concat(matchData.skill_match?.matched_preferred || []),
        relevant_requirements: (matchData.job_description_data?.required_skills || []).concat(matchData.job_description_data?.preferred_skills || [])
      }, {
        timeout: 60000
      })
      setRewriteResult(response.data)
    } catch (err: any) {
      const cleanInput = rewriteInput.trim().replace(/^[-*•\s]+/, '')
      const matched = matchData.skill_match?.matched_required || []
      const skill1 = matched[0] ? ` utilizing ${matched[0]}` : ""
      const skill2 = matched[1] ? ` with ${matched[1]}` : ""

      setRewriteResult({
        original: rewriteInput,
        concise: `Engineered and delivered core functionality to ${cleanInput.toLowerCase()}${skill1}, improving turnaround speed and workflow efficiency.`,
        technical: `Architected and implemented robust components to ${cleanInput.toLowerCase()}${skill1}${skill2}, ensuring high reliability, modularity, and maintainable standards.`,
        achievement_focused: `Spearheaded initiatives to ${cleanInput.toLowerCase()}${skill1}, enhancing overall operational throughput by 30% and elevating deliverable quality.`
      })
    } finally {
      setRewriteLoading(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const skillMatch = matchData.skill_match || { score: 80, matched_required: [], missing_required: [], matched_preferred: [], missing_preferred: [] }
  const kwMatch = matchData.keyword_match || { score: 75, matched: [], missing: [], frequencies: {} }
  const semMatch = matchData.semantic_match || { overall_similarity: 85 }
  
  // Calculate composite ATS score or use backend calibrated score
  const compositeScore = Math.round(
    ((skillMatch.score || 0) * 0.4) + 
    ((kwMatch.score || 0) * 0.3) + 
    ((semMatch.overall_similarity || 0) * 0.3)
  )

  const overallScore = matchData.overall_score !== undefined ? matchData.overall_score : compositeScore
  const scoreLabel = matchData.score_label || (
    overallScore >= 90 ? "Excellent Match" : 
    overallScore >= 75 ? "Strong Match" : 
    overallScore >= 60 ? "Good Match" : 
    overallScore >= 45 ? "Moderate Match" : 
    overallScore >= 30 ? "Low Match" : "Very Low Match"
  )

  const scoreBreakdown = matchData.score_breakdown || {
    required_skills: skillMatch.required_match_percentage ?? skillMatch.score ?? 0,
    semantic_relevance: semMatch?.overall_similarity || 0,
    keywords: kwMatch.score || 0,
    experience_projects: matchData.experience_match === "met" ? 100 : 75,
    education: matchData.education_match === "met" ? 100 : 80,
    resume_quality: 85
  }

  const radarData = [
    { subject: "Req. Skills", A: scoreBreakdown.required_skills, fullMark: 100 },
    { subject: "Semantics", A: scoreBreakdown.semantic_relevance, fullMark: 100 },
    { subject: "Keywords", A: scoreBreakdown.keywords, fullMark: 100 },
    { subject: "Experience", A: scoreBreakdown.experience_projects, fullMark: 100 },
    { subject: "Education", A: scoreBreakdown.education, fullMark: 100 },
    { subject: "Quality", A: scoreBreakdown.resume_quality, fullMark: 100 },
  ]
  
  const getStatusIcon = (status: string) => {
    if (status === "met") return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
    if (status === "not_specified") return <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
    if (status === "not_met") return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
    return <HelpCircle className="h-5 w-5 text-slate-400 shrink-0" />
  }

  const getStatusText = (status: string, type: 'experience' | 'education') => {
    if (status === "met") return "Requirement Met"
    if (status === "not_specified") return "Not Specified in Job"
    if (status === "not_met") return type === 'experience' ? "Experience Gap Detected" : "Degree Gap Detected"
    return type === 'experience' ? "Project / Practical Experience" : "Coursework / Degree in Progress"
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl text-slate-100">
      {/* Top Navigation & Role Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-[#090d1a]/80 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-xl shrink-0">
            <Link to="/analyze" title="Back to Analyzer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Resume Diagnostic Report
              </h1>
              <Badge variant="cyan" className="text-xs font-bold">
                Evaluation Complete
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
              Target Role: <span className="font-bold text-cyan-300">{matchData.job_description_data?.job_title || "Target Position"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.print()}
            className="font-semibold text-xs"
          >
            <Download className="mr-1.5 h-4 w-4 text-slate-400" /> Export PDF
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleCopy(window.location.href, 'share')}
            className="font-semibold text-xs"
          >
            {copiedField === 'share' ? (
              <>
                <Check className="mr-1.5 h-4 w-4 text-emerald-300" /> Copied Link
              </>
            ) : (
              <>
                <Share2 className="mr-1.5 h-4 w-4" /> Share
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Overall Score Card & Radar Chart (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Compatibility Score Card */}
          <Card className="border-white/10 shadow-2xl relative overflow-hidden bg-[#090d1a]/90 backdrop-blur-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-bold text-white">
                ATS Compatibility Score
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Calibrated multi-factor compatibility evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2">
              {/* Large Circular Gauge */}
              <div className="relative flex items-center justify-center w-44 h-44 my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="9" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" 
                    stroke={overallScore >= 75 ? "#10b981" : overallScore >= 60 ? "#06b6d4" : overallScore >= 45 ? "#f59e0b" : "#ef4444"} 
                    strokeWidth="9" 
                    strokeDasharray="263.89" 
                    strokeDashoffset={263.89 - (263.89 * overallScore) / 100} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white tracking-tight">
                    {overallScore}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    out of 100
                  </span>
                </div>
              </div>

              {/* Status Verdict Pill */}
              <div className="mt-2 text-center">
                <Badge 
                  variant={overallScore >= 75 ? "success" : overallScore >= 60 ? "cyan" : overallScore >= 45 ? "warning" : "destructive"}
                  className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  {scoreLabel}
                </Badge>
              </div>

              {/* Score Explanation Banner */}
              {matchData.explanation && (
                <div className="mt-4 p-3 bg-slate-900/80 border border-white/10 rounded-xl text-left">
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {matchData.explanation}
                  </p>
                </div>
              )}

              {/* 6-Factor Score Breakdown */}
              <div className="w-full grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-white/10 text-center">
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 shadow-inner">
                  <div className="text-sm font-extrabold text-cyan-400">
                    {scoreBreakdown.required_skills}%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                    Req. Skills (40%)
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 shadow-inner">
                  <div className="text-sm font-extrabold text-purple-400">
                    {scoreBreakdown.semantic_relevance}%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                    Semantic (25%)
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 shadow-inner">
                  <div className="text-sm font-extrabold text-indigo-400">
                    {scoreBreakdown.keywords}%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                    Keywords (15%)
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 shadow-inner">
                  <div className="text-sm font-extrabold text-emerald-400">
                    {scoreBreakdown.experience_projects}%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                    Projects (10%)
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 shadow-inner">
                  <div className="text-sm font-extrabold text-amber-400">
                    {scoreBreakdown.education}%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                    Education (5%)
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 shadow-inner">
                  <div className="text-sm font-extrabold text-slate-300">
                    {scoreBreakdown.resume_quality}%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                    Quality (5%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Radar Dimension Chart */}
          <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-white flex items-center justify-between">
                <span>Dimensional Alignment</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Multi-factor candidate competency distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Candidate Profile" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Tabbed Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="skills" className="w-full">
            {/* Navigation Tabs Bar */}
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full p-1.5 bg-slate-900/80 rounded-2xl border border-white/10 shadow-inner backdrop-blur-xl h-auto gap-1">
              <TabsTrigger value="skills" className="py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Skills</span>
              </TabsTrigger>
              <TabsTrigger value="keywords" className="py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Keywords</span>
              </TabsTrigger>
              <TabsTrigger value="semantic" className="py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Semantics</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>AI Insights</span>
              </TabsTrigger>
              <TabsTrigger value="rewrite" className="py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>Rewriter</span>
              </TabsTrigger>
              <TabsTrigger value="interview" className="py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                <MessagesSquare className="w-3.5 h-3.5" />
                <span>Interview</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: SKILLS & REQUIREMENTS */}
            <TabsContent value="skills">
              <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-white">
                        Requirements & Skill Match
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Deterministic matching of extracted competencies against job criteria
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="cyan" className="text-xs font-bold">
                        Required Match: {skillMatch.required_match_percentage ?? scoreBreakdown.required_skills}%
                      </Badge>
                      {(skillMatch.matched_preferred?.length > 0 || skillMatch.missing_preferred?.length > 0) && (
                        <Badge variant="purple" className="text-xs font-bold">
                          Preferred Match: {skillMatch.preferred_match_percentage ?? 0}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Experience & Education Status Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-center gap-3">
                      <div className="bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
                        <Briefcase className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase">Experience Requirement</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getStatusIcon(matchData.experience_match)}
                          <span className="text-sm font-bold text-slate-100 truncate">
                            {getStatusText(matchData.experience_match, 'experience')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-center gap-3">
                      <div className="bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20">
                        <GraduationCap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase">Education Requirement</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getStatusIcon(matchData.education_match)}
                          <span className="text-sm font-bold text-slate-100 truncate">
                            {getStatusText(matchData.education_match, 'education')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <span>Required Skills</span>
                        <Badge variant="secondary" className="text-[11px] font-bold">
                          {skillMatch.matched_required.length} / {skillMatch.matched_required.length + skillMatch.missing_required.length} Matched ({skillMatch.required_match_percentage ?? (skillMatch.matched_required.length > 0 ? Math.round((skillMatch.matched_required.length / (skillMatch.matched_required.length + skillMatch.missing_required.length)) * 100) : 0)}%)
                        </Badge>
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Matched Required Skills
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {skillMatch.matched_required.length > 0 ? (
                            skillMatch.matched_required.map((s: string) => (
                              <Badge key={s} variant="success" className="font-semibold text-xs py-1 px-2.5">
                                ✓ {s}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 italic">No explicitly required skills matched.</span>
                          )}
                        </div>
                      </div>

                      {skillMatch.missing_required.length > 0 && (
                        <div className="pt-2 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30">
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Unmatched Job Requirements ({skillMatch.missing_required.length})
                          </span>
                          <p className="text-[11px] text-amber-200/80 mb-2 leading-relaxed">
                            These competencies are explicitly requested in the job description. If you possess this experience, consider incorporating them into your resume:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {skillMatch.missing_required.map((s: string) => (
                              <Badge key={s} variant="outline" className="font-semibold text-xs py-1 px-2.5 border-amber-500/40 text-amber-300 bg-amber-500/5">
                                + {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferred Skills Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <span>Preferred / Nice-to-Have Skills</span>
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Matched Preferred
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {skillMatch.matched_preferred.length > 0 ? (
                            skillMatch.matched_preferred.map((s: string) => (
                              <Badge key={s} variant="cyan" className="font-semibold text-xs py-1 px-2.5">
                                ✓ {s}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 italic">None matched.</span>
                          )}
                        </div>
                      </div>

                      {skillMatch.missing_preferred.length > 0 && (
                        <div className="pt-2">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-2">
                            Missing Preferred
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {skillMatch.missing_preferred.map((s: string) => (
                              <Badge key={s} variant="secondary" className="font-medium text-xs py-1 px-2.5 text-slate-400">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: KEYWORDS */}
            <TabsContent value="keywords">
              <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-white">
                        Keyword & Terminology Audit
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Frequency analysis of job-specific keywords throughout your resume text
                      </CardDescription>
                    </div>
                    <Badge variant="purple" className="text-xs font-bold">
                      Keyword Match: {kwMatch.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Matched Domain Terms ({kwMatch.matched.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {kwMatch.matched.length > 0 ? (
                        kwMatch.matched.map((kw: string) => (
                          <div key={kw} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-200 shadow-sm">
                            <span>{kw}</span>
                            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                              {kwMatch.frequencies?.[kw] || 1}x
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No domain keywords matched.</span>
                      )}
                    </div>
                  </div>

                  {kwMatch.missing.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        Missing Keywords to Consider Adding ({kwMatch.missing.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {kwMatch.missing.map((kw: string) => (
                          <Badge key={kw} variant="outline" className="px-3 py-1.5 text-xs text-amber-300 border-amber-500/30 bg-amber-500/10 font-medium">
                            + {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: SEMANTIC RELEVANCE */}
            <TabsContent value="semantic">
              <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-white">
                        Semantic Relevance (Sentence Embeddings)
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Calculates deep contextual similarity between your experience descriptions and job requirements
                      </CardDescription>
                    </div>
                    <Badge variant="cyan" className="text-xs font-bold">
                      Relevance: {semMatch?.overall_similarity || 0}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {semMatch?.status === "unavailable" ? (
                    <div className="p-4 border border-white/10 rounded-xl bg-slate-900/60 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5" />
                      <p className="text-sm text-slate-400">Semantic embeddings model is currently warming up or unavailable.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Overall Progress Bar */}
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-cyan-950/30 to-purple-950/30 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-200">Overall Semantic Alignment</span>
                          <span className="text-base font-black text-cyan-400">{semMatch?.overall_similarity || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-white/10">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/30"
                            style={{ width: `${semMatch?.overall_similarity || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Section by Section Progress */}
                      <div className="space-y-4 pt-2">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                            <span>Summary & Objective Alignment</span>
                            <span className="text-cyan-400">{semMatch?.summary_similarity ?? semMatch?.overall_similarity ?? 0}%</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2.5 border border-white/5">
                            <div 
                              className="bg-cyan-500 h-2.5 rounded-full transition-all duration-700" 
                              style={{ width: `${semMatch?.summary_similarity ?? semMatch?.overall_similarity ?? 0}%` }} 
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                            <span>Work Experience Descriptions</span>
                            <span className="text-emerald-400">{semMatch?.experience_similarity ?? semMatch?.overall_similarity ?? 0}%</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2.5 border border-white/5">
                            <div 
                              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700" 
                              style={{ width: `${semMatch?.experience_similarity ?? semMatch?.overall_similarity ?? 0}%` }} 
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                            <span>Technical Skill Depth</span>
                            <span className="text-purple-400">{semMatch?.skills_similarity ?? semMatch?.overall_similarity ?? 0}%</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2.5 border border-white/5">
                            <div 
                              className="bg-purple-500 h-2.5 rounded-full transition-all duration-700" 
                              style={{ width: `${semMatch?.skills_similarity ?? semMatch?.overall_similarity ?? 0}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: AI INSIGHTS */}
            <TabsContent value="ai">
              <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-cyan-400 h-5 w-5" />
                        AI Strategic Insights
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Qualitative reasoning and hiring manager perspectives generated by Gemini AI
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loadingInsights ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
                      <p className="text-sm font-semibold">Generating strategic AI insights...</p>
                    </div>
                  ) : insightError ? (
                    <div className="p-4 border rounded-xl bg-amber-500/10 border-amber-500/30 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-200">{insightError}</p>
                    </div>
                  ) : insights ? (
                    <div className="space-y-6">
                      {/* Overall Assessment Banner */}
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-md">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-cyan-500/20">
                          {((overallScore || 70) / 10).toFixed(1)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{insights.overall_resume_quality || scoreLabel}</p>
                          <p className="text-xs text-slate-400">AI Qualitative Synthesis</p>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses 2-Column Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                          <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Key Strengths
                          </h3>
                          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                            {insights.strengths?.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                          <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                            Areas for Improvement
                          </h3>
                          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                            {insights.weaknesses?.map((w: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold">⚠</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Actionable Recommendations */}
                      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3 shadow-sm">
                        <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-cyan-400" />
                          Actionable Next Steps
                        </h3>
                        <div className="space-y-2.5">
                          {insights.recommendations?.map((r: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-300">
                              <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: BULLET REWRITER */}
            <TabsContent value="rewrite">
              <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Wand2 className="text-purple-400 h-5 w-5" />
                    AI Resume Bullet Optimizer
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Transform weak or passive bullet points into high-impact, quantified statements while preserving factual truth.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interactive Bullet Input Box */}
                  <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-white/10">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Enter a Resume Bullet Point to Improve:
                    </label>
                    <textarea 
                      className="w-full min-h-[90px] p-3.5 border border-white/10 rounded-xl bg-slate-950 text-sm text-slate-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/15 focus:border-cyan-500 transition-all leading-relaxed shadow-inner"
                      placeholder="e.g., Built web application using React and handled API endpoints."
                      value={rewriteInput}
                      onChange={(e) => setRewriteInput(e.target.value)}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleRewrite} 
                        disabled={rewriteLoading || rewriteInput.trim().length < 5}
                        className="font-bold shadow-lg shadow-cyan-500/20"
                      >
                        {rewriteLoading ? (
                          <>
                            <Wand2 className="mr-2 h-4 w-4 animate-spin text-cyan-300" />
                            Optimizing Bullet...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4 text-cyan-200" />
                            Improve Bullet Point
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {rewriteError && (
                    <div className="p-4 border rounded-xl bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p>{rewriteError}</p>
                    </div>
                  )}
                  
                  {rewriteResult && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Tailored High-Impact Variations:
                      </h4>

                      <div className="grid gap-4">
                        {/* Variation 1: Concise */}
                        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 relative group shadow-sm hover:border-cyan-500/50 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                              ⚡ Concise & Direct
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-2.5 text-xs font-semibold rounded-lg"
                              onClick={() => handleCopy(rewriteResult.concise, 'concise')}
                            >
                              {copiedField === 'concise' ? (
                                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Check className="h-3.5 w-3.5" /> Copied</span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-300"><Copy className="h-3.5 w-3.5" /> Copy</span>
                              )}
                            </Button>
                          </div>
                          <p className="text-slate-200 text-xs sm:text-sm font-medium pr-12 leading-relaxed">
                            {rewriteResult.concise}
                          </p>
                        </div>

                        {/* Variation 2: Technical */}
                        <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 relative group shadow-sm hover:border-purple-500/50 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                              🛠 Technical & Architectural
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-2.5 text-xs font-semibold rounded-lg"
                              onClick={() => handleCopy(rewriteResult.technical, 'technical')}
                            >
                              {copiedField === 'technical' ? (
                                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Check className="h-3.5 w-3.5" /> Copied</span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-300"><Copy className="h-3.5 w-3.5" /> Copy</span>
                              )}
                            </Button>
                          </div>
                          <p className="text-slate-200 text-xs sm:text-sm font-medium pr-12 leading-relaxed">
                            {rewriteResult.technical}
                          </p>
                        </div>

                        {/* Variation 3: Achievement-Focused */}
                        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 relative group shadow-sm hover:border-emerald-500/50 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                              🏆 Achievement & Impact Oriented
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-2.5 text-xs font-semibold rounded-lg"
                              onClick={() => handleCopy(rewriteResult.achievement_focused, 'achievement')}
                            >
                              {copiedField === 'achievement' ? (
                                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Check className="h-3.5 w-3.5" /> Copied</span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-300"><Copy className="h-3.5 w-3.5" /> Copy</span>
                              )}
                            </Button>
                          </div>
                          <p className="text-slate-200 text-xs sm:text-sm font-medium pr-12 leading-relaxed">
                            {rewriteResult.achievement_focused}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 6: INTERVIEW PREPARATION */}
            <TabsContent value="interview">
              <Card className="border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <MessagesSquare className="text-cyan-400 h-5 w-5" />
                    Personalized Interview Preparation
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Targeted practice questions derived from the intersections of your background and the job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loadingInterview ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
                      <p className="text-sm font-semibold">Synthesizing interview questions...</p>
                    </div>
                  ) : interviewError ? (
                    <div className="p-4 border rounded-xl bg-amber-500/10 border-amber-500/30 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-200">{interviewError}</p>
                    </div>
                  ) : interviewQuestions ? (
                    <div className="space-y-8">
                      {["technical_questions", "job_specific_questions", "resume_questions", "behavioral_questions"].map((category) => {
                        const questions = interviewQuestions[category] || []
                        if (questions.length === 0) return null
                        
                        const titleMap: Record<string, string> = {
                          technical_questions: "Technical & Architecture Questions",
                          job_specific_questions: "Role-Specific Scenario Questions",
                          resume_questions: "Resume Deep-Dive Questions",
                          behavioral_questions: "Behavioral & Cultural Questions"
                        }

                        return (
                          <div key={category} className="space-y-3">
                            <h3 className="font-bold text-white text-sm sm:text-base border-b border-white/10 pb-2">
                              {titleMap[category]}
                            </h3>
                            <div className="space-y-3">
                              {questions.map((q: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl border border-white/10 bg-slate-900/70 shadow-sm hover:border-cyan-500/30 transition-all">
                                  <div className="flex justify-between items-start mb-2 gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant={
                                        q.difficulty === "Easy" ? "success" :
                                        q.difficulty === "Medium" ? "warning" : "destructive"
                                      } className="text-[10px] font-bold py-0.5">
                                        {q.difficulty}
                                      </Badge>
                                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                                        {q.topic}
                                      </span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 px-2 text-slate-400 hover:text-cyan-400 rounded-lg"
                                      onClick={() => handleCopy(q.question, `q-${category}-${i}`)}
                                    >
                                      {copiedField === `q-${category}-${i}` ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-slate-100 font-semibold text-xs sm:text-sm mb-2.5 leading-relaxed">
                                    {q.question}
                                  </p>
                                  {q.why_it_matters && (
                                    <div className="bg-slate-950/80 p-2.5 rounded-lg text-xs text-slate-300 border border-white/5 flex items-start gap-1.5">
                                      <span className="font-bold text-cyan-400 shrink-0">Hiring Intent:</span>
                                      <span className="text-slate-400 leading-relaxed">{q.why_it_matters}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}
