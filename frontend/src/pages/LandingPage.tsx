import { Link } from "react-router-dom"
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  FileText, 
  BrainCircuit, 
  MessagesSquare, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileSearch, 
  TrendingUp, 
  ShieldCheck, 
  Zap 
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Ambient Gradient Glow Blobs in Background */}
        <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 -z-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 -z-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>AI-Powered Resume Optimization</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Make your resume <br className="hidden sm:inline" />
              <span className="gradient-text">stand out</span> for the right job.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Analyze your resume against real job requirements, discover missing skills, improve your bullets with AI, and prepare tailored interview answers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Button size="lg" asChild className="font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35">
                <Link to="/analyze">
                  Analyze My Resume <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-bold text-base border-slate-300/80">
                <Link to="/results">
                  Try Demo Preview
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Deterministic ATS Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Semantic Embeddings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-indigo-600" />
                <span>Gemini AI Insights</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Dashboard Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-md opacity-30 group-hover:opacity-100 transition duration-1000" />

              {/* Glass Card Container */}
              <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 shadow-2xl space-y-6">
                {/* Header with Mock File Tag */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Alex_Rivers_Resume.pdf</h4>
                      <p className="text-xs text-slate-400 font-medium">Target: Senior Full Stack Engineer</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px] font-bold uppercase tracking-wider">
                    Ready
                  </Badge>
                </div>

                {/* Main Score Hero Card */}
                <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white shadow-inner">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Overall ATS Match
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-black tracking-tight text-white">84</span>
                      <span className="text-sm font-medium text-slate-400">/ 100</span>
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      High Compatibility
                    </span>
                  </div>

                  {/* Circular visual ring */}
                  <div className="flex items-center justify-center">
                    <div className="relative h-20 w-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke="#10b981" 
                          strokeWidth="8" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="40.2" 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <div className="text-lg font-extrabold text-indigo-600">91%</div>
                    <div className="text-[10px] font-semibold text-slate-500">Skills Match</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <div className="text-lg font-extrabold text-violet-600">78%</div>
                    <div className="text-[10px] font-semibold text-slate-500">Keywords</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <div className="text-lg font-extrabold text-cyan-600">86%</div>
                    <div className="text-[10px] font-semibold text-slate-500">Semantics</div>
                  </div>
                </div>

                {/* Skill Pills preview */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Key Matched Skills:</span>
                    <span className="text-[11px] text-emerald-600 font-bold">5 Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3" /> React 19
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3" /> TypeScript
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3" /> FastAPI
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3" /> PostgreSQL
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 px-2 py-0.5 rounded-md">
                      <AlertCircle className="h-3 w-3" /> AWS Lambda
                    </span>
                  </div>
                </div>

                {/* Small preview footer */}
                <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Real-time deterministic + AI evaluation sample</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with 4 Modern SaaS Cards */}
      <section className="py-24 px-4 sm:px-6 bg-white border-y border-slate-200/70 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="default" className="font-bold text-xs">
              ENGINEERED FOR HIRING SUCCESS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A complete AI suite for modern job applications.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              We combine deterministic rule-based algorithms with cutting-edge semantic NLP embeddings and LLM reasoning to give you the most accurate feedback possible.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: ATS Analysis */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 md:p-7 hover:bg-white hover:shadow-xl hover:border-indigo-200/90 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">ATS Compatibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates experience, education, and required competencies against applicant tracking system standards with clear scores.
              </p>
            </div>

            {/* Card 2: Skill Matching */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 md:p-7 hover:bg-white hover:shadow-xl hover:border-emerald-200/90 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pinpoints exact required and preferred skills present in the job posting that are missing or matched on your resume.
              </p>
            </div>

            {/* Card 3: AI Insights */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 md:p-7 hover:bg-white hover:shadow-xl hover:border-purple-200/90 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Bullet Rewriter</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transforms weak resume bullets into high-impact, technical, and achievement-oriented statements while preserving factual truth.
              </p>
            </div>

            {/* Card 4: Interview Prep */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 md:p-7 hover:bg-white hover:shadow-xl hover:border-cyan-200/90 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
                <MessagesSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interview Coaching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generates personalized technical, behavioral, and resume deep-dive questions with rationale for interview preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 3-Step Flow */}
      <section className="py-24 px-4 sm:px-6 bg-slate-50/80 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How it works in 3 simple steps</h2>
            <p className="text-slate-600 text-base">
              Get comprehensive career analysis and recommendations in less than 30 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm relative flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-500/25">
                01
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Upload Your Resume</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload your resume in PDF or DOCX format. Our parsers cleanly extract structure, experience, and competencies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm relative flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-purple-500/25">
                02
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Paste Job Description</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Paste the target job description or requirements. Our system extracts core responsibilities and keywords.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm relative flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-cyan-500/25">
                03
              </div>
              <div className="h-10 w-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Get AI-Powered Analysis</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Instantly view ATS scores, semantic relevance graphs, missing skills, bullet revisions, and interview prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full mb-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to optimize your resume for your dream role?
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              Join thousands of professionals landing interviews faster with automated ATS audits and AI coaching.
            </p>
          </div>
          <Button size="lg" asChild className="bg-white text-indigo-900 hover:bg-slate-100 font-bold shadow-xl shrink-0">
            <Link to="/analyze">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
