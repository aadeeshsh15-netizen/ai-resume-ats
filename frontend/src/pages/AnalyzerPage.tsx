import { API_URL } from '../config';
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { 
  Upload, 
  X, 
  Sparkles, 
  Loader2, 
  Play, 
  AlertCircle, 
  FileCheck2, 
  Briefcase,
  ArrowRight,
  Info
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
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

const LOADING_STEPS = [
  "Uploading resume document...",
  "Parsing resume & extracting competencies...",
  "Analyzing job description requirements...",
  "Matching skills & domain keywords...",
  "Calculating semantic relevance embeddings...",
  "Preparing diagnostic report..."
]

import { extractApiError } from "../lib/api-errors"

export default function AnalyzerPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Step indicator animation during analysis
  useEffect(() => {
    let interval: any
    if (isAnalyzing) {
      setLoadingStepIndex(0)
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
      }, 900)
    } else {
      setLoadingStepIndex(0)
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
      setUploadError("Please enter or paste a job description.")
      return
    }

    if (trimmedJd.length < 50) {
      setUploadError(`The job description is too short (${trimmedJd.length} characters). Please provide a realistic job description with at least 50 characters to perform accurate matching.`)
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
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl text-slate-100">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time ATS Diagnostic</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze your resume
        </h1>
        <p className="text-slate-400 text-base max-w-2xl">
          Compare your resume with the job you're targeting. Receive instant compatibility scores, missing keyword alerts, and AI-powered recommendations.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Step 1: Resume Upload Card */}
        <Card className={`flex flex-col border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl transition-all ${!file && uploadError?.includes("resume") ? "border-rose-500/50 ring-2 ring-rose-500/20" : ""}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold text-white">
                <span className="bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-sm shadow-cyan-500/30">
                  1
                </span>
                Upload Resume
              </CardTitle>
              <Badge variant="secondary" className="text-[11px] font-semibold">
                PDF or DOCX
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Maximum file size: 5MB. Clean text-based resumes yield best accuracy.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-center">
            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[240px] cursor-pointer ${
                  isDragging 
                    ? "border-cyan-400 bg-cyan-500/10 scale-[0.99] glow-cyan" 
                    : "border-white/15 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/70"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-file-input')?.click()}
              >
                <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/40 mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Drag & drop your resume here
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Supports PDF or Word documents (.docx) up to 5MB
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  className="font-bold pointer-events-none"
                >
                  Browse Computer
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
              <div className="rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/10 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="bg-emerald-500 text-slate-950 p-3 rounded-xl shadow-xs shrink-0 font-black">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">
                        {file.name}
                      </h4>
                      <Badge variant="success" className="text-[10px] py-0 px-2 font-bold shrink-0">
                        Ready
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.name.endsWith('.pdf') ? 'PDF Document' : 'DOCX Document'}
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
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Job Description Card */}
        <Card className={`flex flex-col border-white/10 shadow-xl bg-[#090d1a]/90 backdrop-blur-2xl transition-all ${isJdTooShort ? "border-amber-500/40 ring-2 ring-amber-500/20" : ""}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold text-white">
                <span className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-sm shadow-purple-500/30">
                  2
                </span>
                Job Description
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Quick sample:</span>
                <button 
                  type="button" 
                  onClick={() => loadSample('frontend')}
                  className="text-cyan-400 hover:underline font-bold text-xs cursor-pointer"
                >
                  Frontend
                </button>
                <span>•</span>
                <button 
                  type="button" 
                  onClick={() => loadSample('fullstack')}
                  className="text-purple-400 hover:underline font-bold text-xs cursor-pointer"
                >
                  Full Stack
                </button>
              </div>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Paste the complete target job description (minimum 50 characters required).
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <Textarea 
              placeholder="Paste target job requirements, responsibilities, and required competencies here..." 
              className={`flex-1 resize-none min-h-[200px] text-xs sm:text-sm font-normal ${isJdTooShort ? "border-amber-500/40 focus-visible:border-amber-500 focus-visible:ring-amber-500/20" : ""}`}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                if (uploadError && e.target.value.trim().length >= 50) {
                  setUploadError(null)
                }
              }}
            />
            
            <div className="flex items-center justify-between text-xs mt-2.5 px-1 font-medium">
              <div>
                {isJdTooShort ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Need {50 - jobDescription.trim().length} more characters
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                )}
              </div>
              <span className={jobDescription.trim().length >= 50 ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                {jobDescription.trim().length} / 50 min chars
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Error Banner */}
      {uploadError && (
        <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs sm:text-sm font-medium shadow-lg animate-in fade-in-50 duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold text-rose-200 block mb-0.5">Analysis Request Error</span>
            {uploadError}
          </div>
          <button 
            type="button" 
            onClick={() => setUploadError(null)} 
            className="text-rose-400 hover:text-rose-200 p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="mt-8 rounded-2xl bg-[#090d1a]/90 border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-2xl">
        <div className="flex items-center gap-3 text-sm text-slate-300 text-center sm:text-left">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-white">Ready to evaluate your match?</p>
            <p className="text-xs text-slate-400">
              {isAnalyzing 
                ? LOADING_STEPS[loadingStepIndex] 
                : "Deterministic scoring & semantic analysis run locally in real-time."
              }
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleDemo} 
            disabled={isAnalyzing} 
            className="w-full sm:w-auto font-bold"
          >
            <Play className="w-4 h-4 mr-2 text-cyan-400" />
            Try with Demo Data
          </Button>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full sm:w-auto min-w-[220px] font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-cyan-300" />
                <span>{LOADING_STEPS[loadingStepIndex]}</span>
              </>
            ) : (
              <>
                Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
