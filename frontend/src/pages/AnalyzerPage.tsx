import { API_URL } from '../config';
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { 
  Upload, 
  X, 
  Loader2, 
  Play, 
  AlertCircle, 
  FileCheck2, 
  ArrowRight,
  Info
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { useAuth } from "../context/AuthContext"

const SAMPLE_JDS = {
  frontend: `Role: Senior Frontend Engineer
Location: Remote / Hybrid
Key Responsibilities:
- Build responsive, accessible web applications using React 19, TypeScript, and Tailwind CSS.
- Optimize web application performance, accessibility, and SEO.
- Collaborate with UX designers and backend engineers to integrate REST & GraphQL APIs.
- Write robust unit and integration tests using Jest, Vitest, and Cypress.
Required Skills: React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, REST APIs, Git.
Preferred Skills: Next.js, Redux Toolkit, Webpack/Vite, CI/CD, Docker, Jest.`,
  fullstack: `Role: Full Stack Software Engineer
Location: San Francisco, CA / Remote
Responsibilities:
- Design and develop scalable backend APIs using Python, FastAPI, or Node.js.
- Architect relational database schemas in PostgreSQL and manage migrations.
- Build clean, intuitive client interfaces in React and TypeScript.
- Implement secure authentication mechanisms using JWT and OAuth2.
- Deploy microservices to AWS cloud infrastructure using Docker and Kubernetes.
Required Skills: Python, FastAPI, React, TypeScript, PostgreSQL, REST APIs, Docker, Git.
Preferred Skills: AWS (S3, EC2, Lambda), Redis, CI/CD, PyTest, Tailwind CSS.`,
}

const PROGRESS_PHASES = [
  { id: "resume", label: "RESUME PARSING" },
  { id: "job", label: "JOB ANALYSIS" },
  { id: "skills", label: "SKILL MATCHING" },
  { id: "semantic", label: "SEMANTIC ANALYSIS" },
  { id: "insights", label: "AI INSIGHTS" }
]

import { extractApiError } from "../lib/api-errors"

export default function AnalyzerPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Step indicator animation during analysis
  useEffect(() => {
    let interval: any
    if (isAnalyzing) {
      setActivePhaseIndex(0)
      interval = setInterval(() => {
        setActivePhaseIndex((prev) => (prev < PROGRESS_PHASES.length - 1 ? prev + 1 : prev))
      }, 750)
    } else {
      setActivePhaseIndex(0)
    }
    return () => clearInterval(interval)
  }, [isAnalyzing])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.name.endsWith(".docx") ||
        droppedFile.name.endsWith(".pdf")
      ) {
        if (droppedFile.size > 5 * 1024 * 1024) {
          setUploadError("File is too large. Maximum allowed size is 5MB.")
          return
        }
        if (droppedFile.size === 0) {
          setUploadError("The uploaded file is empty.")
          return
        }
        setFile(droppedFile)
        setUploadError(null)
      } else {
        setUploadError("Invalid file format. Please upload a PDF or DOCX file.")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError("File is too large. Maximum allowed size is 5MB.")
        return
      }
      if (selectedFile.size === 0) {
        setUploadError("The uploaded file is empty.")
        return
      }
      setFile(selectedFile)
      setUploadError(null)
    }
  }

  const handleAnalyze = async () => {
    setUploadError(null)

    // 1. Validate resume file
    if (!file) {
      setUploadError("Please select or drop a PDF or DOCX resume before analyzing.")
      return
    }

    // 2. Validate job description presence and length
    const trimmedJd = jobDescription.trim()
    if (!trimmedJd) {
      setUploadError("Please provide a job description to evaluate against your resume.")
      return
    }
    if (trimmedJd.length < 50) {
      setUploadError(`Job description is too brief (${trimmedJd.length} chars). Minimum 50 characters required.`)
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("job_description", trimmedJd)

      const response = await axios.post(`${API_URL}/api/analyze/match`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000
      })

      const matchData = response.data

      // Optionally save to history if logged in
      if (token && matchData.status === "success") {
        try {
          const overallScore = matchData.overall_score ?? Math.round((matchData.skill_match.score + matchData.keyword_match.score + matchData.semantic_match.score) / 3)

          await axios.post(`${API_URL}/api/analyses`, {
            job_title: matchData.job_description_data?.job_title || "Unknown Job",
            resume_data: matchData.resume_data,
            job_description_data: matchData.job_description_data,
            skill_match: matchData.skill_match,
            keyword_match: matchData.keyword_match,
            semantic_match: matchData.semantic_match,
            overall_score: overallScore
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        } catch (saveErr) {
          console.warn("Failed to save analysis to history", saveErr)
        }
      }

      if (matchData.status === "success") {
        setTimeout(() => {
          navigate("/results", { state: { matchData } })
        }, 500)
      }
    } catch (error: any) {
      setIsAnalyzing(false)
      const userMessage = extractApiError(error)
      setUploadError(userMessage)
    }
  }

  const handleDemo = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      navigate("/results")
    }, 1200)
  }

  const loadSample = (type: 'frontend' | 'fullstack') => {
    setJobDescription(SAMPLE_JDS[type])
    setUploadError(null)
  }

  const isJdTooShort = jobDescription.trim().length > 0 && jobDescription.trim().length < 50

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl text-[#f5f5f5]">
      {/* Editorial Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#bbf451]">
            ANALYSIS CONSOLE // v1.2
          </span>
          <span className="text-[#333333]">•</span>
          <span className="text-[11px] font-mono text-[#888888]">CALIBRATED ATS PIPELINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Resume Diagnostic Workspace
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] max-w-2xl leading-relaxed">
          Upload your candidate document and paste the target job specification to initiate deterministic skill classification, keyword extraction, and semantic relevance scoring.
        </p>
      </div>

      {/* Two Column Console Workspace */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* Panel 1: Resume Upload Panel */}
        <div className={`rounded-2xl border border-[#222222] bg-[#111111] p-6 flex flex-col justify-between space-y-4 ${!file && uploadError?.includes("resume") ? "border-red-500/50" : ""}`}>
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#bbf451]">SOURCE 01</span>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Resume Document</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1a1a1a] text-[#a0a0a0] border border-[#2a2a2a] px-2.5 py-1 rounded-md">
              PDF / DOCX
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-7 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] cursor-pointer ${
                  isDragging 
                    ? "border-[#bbf451] bg-[#bbf451]/5" 
                    : "border-[#262626] hover:border-[#444444] bg-[#141414] hover:bg-[#161616]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-file-input')?.click()}
              >
                <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl flex items-center justify-center mb-3 text-[#bbf451]">
                  <Upload className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">
                  Drop Resume File Here
                </h4>
                <p className="text-[11px] text-[#737373] mb-4">
                  Supports PDF or Word documents (.docx) up to 5MB
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  className="font-bold text-xs uppercase tracking-wider pointer-events-none"
                >
                  Browse Files
                </Button>
                <input 
                  id="resume-file-input"
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  onChange={handleFileChange} 
                />
              </div>
            ) : (
              <div className="rounded-xl p-4 border border-[#282828] bg-[#161616] flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-[#bbf451] text-[#050505] p-2.5 rounded-lg shrink-0 font-black">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {file.name}
                      </h4>
                      <p className="text-[11px] text-[#737373] mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setUploadError(null)
                    }} 
                    className="text-[#737373] hover:text-red-400 hover:bg-red-500/10 rounded-lg h-8 w-8"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222222] text-[11px]">
                  <div>
                    <span className="text-[#666666] block">INGESTION STATUS</span>
                    <span className="text-[#bbf451] font-bold">READY</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">PARSER ENGINE</span>
                    <span className="text-white font-bold">NLP + REGEX</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Job Description Panel */}
        <div className={`rounded-2xl border border-[#222222] bg-[#111111] p-6 flex flex-col justify-between space-y-4 ${isJdTooShort ? "border-amber-500/40" : ""}`}>
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#fb923c]">SOURCE 02</span>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Target Job Criteria</h3>
            </div>
            {/* Presets */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-[#666666] text-[10px] uppercase">PRESET:</span>
              <button 
                type="button" 
                onClick={() => loadSample('frontend')}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1c1c1c] hover:bg-[#252525] text-[#bbf451] border border-[#2a2a2a] cursor-pointer"
              >
                Frontend
              </button>
              <button 
                type="button" 
                onClick={() => loadSample('fullstack')}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1c1c1c] hover:bg-[#252525] text-[#fb923c] border border-[#2a2a2a] cursor-pointer"
              >
                Full Stack
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <Textarea 
              placeholder="Paste target job responsibilities, requirements, and required skills here..." 
              className={`flex-1 resize-none min-h-[190px] text-xs font-mono leading-relaxed bg-[#141414] border-[#222222] ${isJdTooShort ? "border-amber-500/40" : ""}`}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                if (uploadError && e.target.value.trim().length >= 50) {
                  setUploadError(null)
                }
              }}
            />
            
            <div className="flex items-center justify-between text-[11px] mt-2.5 px-1 font-semibold text-[#666666]">
              <div>
                {isJdTooShort ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Info className="h-3 w-3" /> Need {50 - jobDescription.trim().length} more characters
                  </span>
                ) : (
                  <span>{jobDescription.trim().split(/\s+/).filter(Boolean).length} words</span>
                )}
              </div>
              <span className={jobDescription.trim().length >= 50 ? "text-[#bbf451]" : "text-[#666666]"}>
                {jobDescription.trim().length} / 50 min chars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Progress State (Shown during analysis) */}
      {isAnalyzing && (
        <div className="mt-6 p-5 rounded-2xl bg-[#0f0f0f] border border-[#262626] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
              PIPELINE EXECUTION IN PROGRESS
            </span>
            <span className="text-xs font-mono text-[#888888]">
              STAGE {activePhaseIndex + 1} OF 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
            {PROGRESS_PHASES.map((phase, idx) => {
              const isDone = idx < activePhaseIndex
              const isCurrent = idx === activePhaseIndex
              return (
                <div 
                  key={phase.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDone 
                      ? "bg-[#14200a] border-[#2d4d12] text-[#bbf451]" 
                      : isCurrent 
                      ? "bg-[#222222] border-[#444444] text-white" 
                      : "bg-[#141414] border-[#1f1f1f] text-[#555555]"
                  }`}
                >
                  <span className="text-[11px] font-bold">{phase.label}</span>
                  <span className="font-bold">
                    {isDone ? "✓" : isCurrent ? "●" : "○"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {uploadError && (
        <div className="mt-6 p-4 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-300 text-xs sm:text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold text-red-200 block mb-0.5">Console Error</span>
            {uploadError}
          </div>
          <button 
            type="button" 
            onClick={() => setUploadError(null)} 
            className="text-red-400 hover:text-red-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bottom Action Console Bar */}
      <div className="mt-6 rounded-2xl bg-[#111111] border border-[#222222] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white">Deterministic + Semantic Matching Ready</p>
          <p className="text-[11px] text-[#737373]">
            Calibrated scoring: 40% skills, 25% semantic NLP, 15% keywords, 10% experience, 5% education, 5% quality.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleDemo} 
            disabled={isAnalyzing} 
            className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 text-[#bbf451]" />
            Demo Data
          </Button>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full sm:w-auto min-w-[200px] font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-[#050505]" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                Run Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
