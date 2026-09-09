import { Link } from "react-router-dom"
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  FileText, 
  MessagesSquare, 
  Upload, 
  FileSearch, 
  TrendingUp
} from "lucide-react"
import { Button } from "../components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-[#f5f5f5] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-3.5 py-1.5 text-xs font-bold text-[#bbf451]">
              <span className="flex h-2 w-2 rounded-full bg-[#bbf451]" />
              <span className="uppercase tracking-wider">AI CAREER INTELLIGENCE PLATFORM</span>
            </div>

            {/* Main Bold Condensed Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#f5f5f5] leading-[1.08]">
              More Than an <br className="hidden sm:inline" />
              ATS Checker. <br />
              <span className="text-[#bbf451]">Your Career Intelligence.</span>
            </h1>

            {/* Editorial Supporting Description */}
            <p className="text-base sm:text-lg text-[#888888] max-w-xl leading-relaxed font-normal">
              Calibrated multi-factor resume evaluation. Audit keyword density, compute semantic NLP match, rewrite weak bullets with Gemini AI, and simulate targeted interview questions before submitting.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-1">
              <Button size="lg" asChild className="font-bold text-sm uppercase tracking-wider px-8 shadow-sm">
                <Link to="/analyze">
                  Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="font-bold text-sm uppercase tracking-wider px-7"
              >
                <Link to="/results">
                  Explore Demo
                </Link>
              </Button>
            </div>

            {/* Precision capability chips */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs font-bold uppercase tracking-wider text-[#737373]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#bbf451]" />
                <span>Deterministic ATS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#fb923c]" />
                <span>Semantic Embeddings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span>Gemini 2.5 Coaching</span>
              </div>
            </div>
          </div>

          {/* Right Column: Reference-Inspired Analytical Console Preview */}
          <div className="lg:col-span-6 relative">
            {/* Outer Dark Dashboard Container */}
            <div className="relative rounded-3xl bg-[#0e0e0e] border border-[#222222] p-5 md:p-6 shadow-2xl space-y-4">
              {/* Console Top Bar */}
              <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#1a1a1a] border border-[#2c2c2c] flex items-center justify-center font-bold text-xs text-[#bbf451]">
                    ATS
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#f5f5f5]">DIAGNOSTIC CONSOLE</h4>
                    <p className="text-[10px] text-[#737373] uppercase font-semibold">Demo Evaluation // Senior Frontend Engineer</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#bbf451]/15 text-[#bbf451] border border-[#bbf451]/30 px-2.5 py-1 rounded-full">
                  CALIBRATED
                </span>
              </div>

              {/* Top 2 Metric Cards Grid (Customer/Product style in reference) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Score Card */}
                <div className="rounded-2xl bg-[#141414] border border-[#222222] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#888888]">COMPATIBILITY</span>
                    <span className="text-[10px] font-bold text-[#bbf451] flex items-center gap-0.5">▲ +4.2%</span>
                  </div>
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white tracking-tight">84</span>
                      <span className="text-xs font-semibold text-[#666666]">/100</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#bbf451] uppercase tracking-wider">STRONG MATCH</span>
                  </div>
                  <div className="text-[10px] text-[#737373]">Deterministic Index</div>
                </div>

                {/* Factors Card */}
                <div className="rounded-2xl bg-[#141414] border border-[#222222] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#888888]">CRITICAL SKILLS</span>
                    <span className="text-[10px] font-bold text-[#fb923c] flex items-center gap-0.5">▼ 2 Gaps</span>
                  </div>
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white tracking-tight">91%</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#f5f5f5] uppercase tracking-wider">8 / 9 MATCHED</span>
                  </div>
                  <div className="text-[10px] text-[#737373]">Required Core Fit</div>
                </div>
              </div>

              {/* Timeline / Distribution Bars (Inspired by Projects Timeline in reference) */}
              <div className="rounded-2xl bg-[#141414] border border-[#222222] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#888888]">
                    COMPETENCY ALIGNMENT MATRIX
                  </span>
                  <span className="text-[10px] font-mono text-[#666666]">WEIGHTED 100%</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Skill item 1: React & TS (Lime) */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-24 text-[11px] font-semibold text-[#a0a0a0] truncate">React & TS</span>
                    <div className="flex-1 h-6 bg-[#1a1a1a] rounded-lg p-0.5 relative overflow-hidden flex items-center">
                      <div className="h-full bg-[#bbf451] rounded-md flex items-center justify-end px-2 text-[10px] font-black text-[#050505]" style={{ width: "94%" }}>
                        94%
                      </div>
                    </div>
                  </div>

                  {/* Skill item 2: REST & GraphQL (Lime) */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-24 text-[11px] font-semibold text-[#a0a0a0] truncate">REST / APIs</span>
                    <div className="flex-1 h-6 bg-[#1a1a1a] rounded-lg p-0.5 relative overflow-hidden flex items-center">
                      <div className="h-full bg-[#bbf451] rounded-md flex items-center justify-end px-2 text-[10px] font-black text-[#050505]" style={{ width: "88%" }}>
                        88%
                      </div>
                    </div>
                  </div>

                  {/* Skill item 3: Semantic Relevance (White) */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-24 text-[11px] font-semibold text-[#a0a0a0] truncate">Semantics</span>
                    <div className="flex-1 h-6 bg-[#1a1a1a] rounded-lg p-0.5 relative overflow-hidden flex items-center">
                      <div className="h-full bg-white rounded-md flex items-center justify-end px-2 text-[10px] font-black text-[#050505]" style={{ width: "86%" }}>
                        86%
                      </div>
                    </div>
                  </div>

                  {/* Skill item 4: Missing Cloud Skills (Orange) */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-24 text-[11px] font-semibold text-[#fb923c] truncate">Cloud / AWS</span>
                    <div className="flex-1 h-6 bg-[#1a1a1a] rounded-lg p-0.5 relative overflow-hidden flex items-center">
                      <div className="h-full bg-[#fb923c] rounded-md flex items-center justify-end px-2 text-[10px] font-black text-[#050505]" style={{ width: "45%" }}>
                        GAP
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend indicator dots like reference bottom right */}
                <div className="pt-2 border-t border-[#1c1c1c] flex items-center justify-between text-[10px] text-[#737373] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#bbf451]" /> Matched</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#fb923c]" /> Gap</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white" /> Semantic</span>
                  </div>
                  <span className="font-mono text-[#888888]">TOTAL FACTORS: 6</span>
                </div>
              </div>

              {/* Bottom Console Status Footnote */}
              <div className="flex items-center justify-between text-[11px] text-[#666666] pt-1">
                <span>Deterministic Scoring + Gemini NLP</span>
                <span className="text-[#bbf451] font-mono">LATENCY: ~1.2s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: 4 Structured Dark Editorial Cards */}
      <section className="py-20 px-4 sm:px-6 bg-[#0a0a0a] border-y border-[#1a1a1a] relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#bbf451]">
              ANALYTICAL SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              A Complete System for Career Compatibility.
            </h2>
            <p className="text-sm sm:text-base text-[#888888] leading-relaxed">
              We combine rule-based deterministic scoring with TF-IDF cosine similarity and Gemini AI coaching for maximum hiring visibility.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: ATS Analysis */}
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-6 hover:border-[#383838] hover:bg-[#141414] transition-all space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#181818] border border-[#2c2c2c] text-[#bbf451] flex items-center justify-center font-bold">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">ATS Matching</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Deterministic matching of extracted competencies against job criteria with transparent 6-factor score breakdowns.
              </p>
            </div>

            {/* Card 2: Skill Matching */}
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-6 hover:border-[#383838] hover:bg-[#141414] transition-all space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#181818] border border-[#2c2c2c] text-[#bbf451] flex items-center justify-center font-bold">
                <FileSearch className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Smart Rewriter</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Transform weak bullet points into high-impact, quantified achievement statements while strictly preserving truthful experience.
              </p>
            </div>

            {/* Card 3: Interview Prep */}
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-6 hover:border-[#383838] hover:bg-[#141414] transition-all space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#181818] border border-[#2c2c2c] text-[#fb923c] flex items-center justify-center font-bold">
                <MessagesSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Interview Prep</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Simulate role-specific technical, behavioral, and resume-gap interview questions tailored directly to the target opportunity.
              </p>
            </div>

            {/* Card 4: Track Progress */}
            <div className="rounded-2xl border border-[#222222] bg-[#111111] p-6 hover:border-[#383838] hover:bg-[#141414] transition-all space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#181818] border border-[#2c2c2c] text-white flex items-center justify-center font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Audit History</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Save and compare resume iterations over time. Monitor compatibility scores across multiple companies and roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 3-Step Flow */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#bbf451]">
              EXECUTION WORKFLOW
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">How It Works in 3 Steps</h2>
            <p className="text-xs sm:text-sm text-[#888888]">
              Comprehensive career compatibility diagnostics in under 30 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-[#111111] rounded-2xl p-7 border border-[#222222] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#bbf451]">01</span>
                <Upload className="h-5 w-5 text-[#888888]" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Upload Resume</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Upload your resume in PDF or DOCX format. Our parser extracts experience, projects, education, and technical competencies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111111] rounded-2xl p-7 border border-[#222222] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#fb923c]">02</span>
                <FileText className="h-5 w-5 text-[#888888]" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Input Job Description</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Paste the target job description. The parser automatically segments mandatory required skills from preferred competencies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111111] rounded-2xl p-7 border border-[#222222] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white">03</span>
                <Sparkles className="h-5 w-5 text-[#888888]" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wide text-white">Run Diagnostic Audit</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Receive the complete score breakdown, missing keyword report, semantic relevance matrix, and AI coaching suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full mb-10">
        <div className="rounded-3xl bg-[#111111] border border-[#262626] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-extrabold uppercase tracking-tight">
              Ready to calibrate your resume?
            </h3>
            <p className="text-xs sm:text-sm text-[#888888]">
              Automated ATS audits, deterministic skill classification, and precision AI coaching.
            </p>
          </div>
          <Button size="lg" asChild className="font-bold text-xs uppercase tracking-wider px-7 shrink-0">
            <Link to="/analyze">
              Launch Diagnostic Scan <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
