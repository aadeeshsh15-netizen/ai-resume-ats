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
    <div className="flex flex-col min-h-screen overflow-hidden text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 -z-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-5 -z-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 -z-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Small Glowing Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-xs shadow-cyan-400" />
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Next-Gen Career Intelligence Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              More Than an ATS Checker. <br className="hidden sm:inline" />
              <span className="gradient-text-cyan">Your Career Co-Pilot.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Match your resume to actual job listings, identify critical skill gaps, rewrite bullets for maximum ATS impact, and practice targeted interview questions before you apply.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Button size="lg" asChild className="font-bold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40">
                <Link to="/analyze">
                  Analyze My Resume <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="font-bold text-base hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:bg-slate-900/60 transition-all duration-300"
              >
                <Link to="/results">
                  Try Demo Preview
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Deterministic ATS Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>Semantic Embeddings</span>
              </div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-purple-400" />
                <span>Gemini AI Insights</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Dashboard Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Cyan/Purple Glow border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-80" />

              {/* Glass Card Container */}
              <div className="relative rounded-2xl bg-[#090d1a]/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl space-y-5">
                {/* Header with Mock File Tag */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold shadow-sm shadow-cyan-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">Alex_Rivers_Resume.pdf</h4>
                      <p className="text-xs text-slate-400 font-medium">Target: Senior Full Stack Engineer</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px] font-bold uppercase tracking-wider">
                    Ready
                  </Badge>
                </div>

                {/* Main Score Hero Card */}
                <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-5 shadow-inner">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Overall ATS Match
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-black tracking-tight text-white">84</span>
                      <span className="text-sm font-medium text-slate-500">/ 100</span>
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      High Compatibility
                    </span>
                  </div>

                  {/* Circular visual ring */}
                  <div className="flex items-center justify-center">
                    <div className="relative h-20 w-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke="#10b981" 
                          strokeWidth="8" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="40.2" 
                          strokeLinecap="round" 
                          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
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
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5">
                    <div className="text-lg font-extrabold text-cyan-400">91%</div>
                    <div className="text-[10px] font-semibold text-slate-400">Skills Match</div>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5">
                    <div className="text-lg font-extrabold text-purple-400">78%</div>
                    <div className="text-[10px] font-semibold text-slate-400">Keywords</div>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5">
                    <div className="text-lg font-extrabold text-emerald-400">86%</div>
                    <div className="text-[10px] font-semibold text-slate-400">Semantics</div>
                  </div>
                </div>

                {/* Skill Pills preview */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>Key Matched Skills:</span>
                    <span className="text-[11px] text-emerald-400 font-bold">5 Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> React 19
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> TypeScript
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> FastAPI
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> PostgreSQL
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md">
                      <AlertCircle className="h-3 w-3 text-rose-400" /> AWS Lambda
                    </span>
                  </div>
                </div>

                {/* Small preview footer */}
                <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-white/10 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Real-time deterministic + AI evaluation preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with 4 Modern Glass Cards */}
      <section className="py-24 px-4 sm:px-6 bg-slate-950/60 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="cyan" className="font-bold text-xs uppercase tracking-wider">
              Engineered For High-Impact Careers
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A complete AI suite for modern job applications.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              We combine deterministic rule-based algorithms with cutting-edge semantic NLP embeddings and Gemini AI coaching to give you the most accurate feedback possible.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: ATS Analysis */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-7 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-sm">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Resume Analysis</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Evaluates experience, education, and required competencies against applicant tracking system standards with transparent scoring breakdowns.
              </p>
            </div>

            {/* Card 2: Skill Matching */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-7 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-sm">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Rewriter</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transforms weak resume bullet points into high-impact, quantified achievement statements while strictly preserving truthful experience.
              </p>
            </div>

            {/* Card 3: Interview Prep */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-7 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                <MessagesSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interview Prep</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generates personalized technical and behavioral interview questions tailored directly to your resume gaps and the job posting.
              </p>
            </div>

            {/* Card 4: Track Progress */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-7 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Track Your Progress</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Save and compare resume iterations over time. Monitor score improvements and measure compatibility across multiple job opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 3-Step Flow */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">How it works in 3 simple steps</h2>
            <p className="text-slate-400 text-base">
              Get comprehensive career analysis and recommendations in less than 30 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl relative flex flex-col items-center text-center space-y-4 hover:border-cyan-500/40 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                01
              </div>
              <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Upload Your Resume</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload your resume in PDF or DOCX format. Our parsers cleanly extract structure, experience, and competencies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl relative flex flex-col items-center text-center space-y-4 hover:border-purple-500/40 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                02
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Paste Job Description</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Paste the target job description or requirements. Our system extracts core responsibilities and keywords.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl relative flex flex-col items-center text-center space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                03
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Get AI-Powered Analysis</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instantly view ATS scores, semantic relevance graphs, missing skills, bullet revisions, and interview prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full mb-12">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to optimize your resume for your dream role?
            </h3>
            <p className="text-sm sm:text-base text-slate-400">
              Transform your job search with automated ATS audits and precision AI coaching.
            </p>
          </div>
          <Button size="lg" asChild className="font-bold shadow-xl shrink-0">
            <Link to="/analyze">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
