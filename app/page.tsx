"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Zap, GraduationCap, History, Cpu, ArrowRight, FileText, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { useGuestId } from "@/lib/guest-identity"
import { apiUrl } from "@/lib/api-url"
import { LoadingFlow } from "@/components/loading-flow"

export default function HomePage() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const guestId = useGuestId()

  const handleAnalyze = async () => {
    if (!question.trim() || !answer.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch(apiUrl("/api/analyze-intent"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, guestId }),
      })
      const data = await response.json()
      if (data.id) router.push(`/result/${data.id}`)
    } catch (error) {
      console.error("Analysis failed:", error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-4 blueprint-grid">
        <div className="w-full max-w-xl tech-card overflow-hidden">
          <LoadingFlow />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-32">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono mb-6">
              <Cpu className="w-3 h-3" />
              ADVANCED COGNITIVE ENGINE V2.0
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tech-heading mb-6 leading-[1.1] gradient-text">
              Predictive Grading. <br />
              <span className="text-blue-600 dark:text-blue-500">Career Launch.</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              AQMD doesn't just grade your answers—it maps your syllabus to real-world career demand and finds the papers you need to master.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => router.push('/papers')}
                className="tech-button-primary px-8 py-4 text-base w-full sm:w-auto"
              >
                <Search className="w-5 h-5" />
                EXPLORE VAULT
              </button>
              <button
                onClick={() => document.getElementById('main-terminal')?.scrollIntoView({ behavior: 'smooth' })}
                className="tech-button px-8 py-4 text-base w-full sm:w-auto"
              >
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                START ANALYSIS
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative order-1 lg:order-2"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-[2rem] -z-10" />
            <div className="tech-card p-6 sm:p-8 border-blue-500/20 aspect-square sm:aspect-auto sm:min-h-[300px] flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mb-6 rounded-2xl sm:rounded-3xl bg-blue-500/10 flex items-center justify-center animate-pulse">
                <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 tech-heading">Predictive Score Tracking</h3>
              <p className="text-muted-foreground text-sm mb-6">Analyze 3 more papers to unlock your {new Date().getFullYear()} Exam Readiness Score.</p>
              <div className="w-full space-y-3">
                <div className="h-2 w-full bg-secondary dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>MASTERY: 67%</span>
                  <span>GOAL: 95%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* The Diagnostic Terminal */}
        <div id="main-terminal" className="max-w-4xl mx-auto scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tech-heading mb-2">Diagnostic Terminal</h2>
              <p className="text-slate-500 text-sm uppercase tracking-[0.3em] font-mono">Input Semantic Alignment Data</p>
            </div>

            <div className="tech-card p-1 shadow-2xl shadow-blue-500/10">
              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="tech-label text-blue-600 dark:text-blue-400">Target Question</label>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">01_QUERY_INPUT</span>
                  </div>
                  <textarea
                    placeholder="Enter the specific question asked..."
                    className="w-full bg-secondary/30 dark:bg-slate-950/50 border border-border dark:border-slate-800 rounded-xl p-5 min-h-[140px] focus:border-blue-500/50 outline-none transition-colors text-foreground dark:text-slate-300 resize-none font-sans"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="tech-label text-purple-600 dark:text-purple-400">Your Response</label>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">02_RESULT_STRING</span>
                  </div>
                  <textarea
                    placeholder="Enter your detailed answer here..."
                    className="w-full bg-secondary/30 dark:bg-slate-950/50 border border-border dark:border-slate-800 rounded-xl p-5 min-h-[180px] focus:border-purple-500/50 outline-none transition-colors text-foreground dark:text-slate-300 resize-none font-sans"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!question.trim() || !answer.trim()}
                  className="w-full tech-button-primary h-14 text-lg group disabled:bg-slate-800 disabled:text-slate-500 transition-all font-bold tracking-widest"
                >
                  <Zap className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" />
                  INITIATE ALIGNMENT CHECK
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Hub Navigation */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <LinkButton
            icon={<History className="w-5 h-5" />}
            title="Syllabus Archives"
            desc="Review your past diagnostic records and improvement curve."
            href="/history"
          />
          <LinkButton
            icon={<FileText className="w-5 h-5" />}
            title="Learning Blueprints"
            desc="Access generated pathways and study maps for your uploads."
            href="/pathways"
          />
          <LinkButton
            icon={<GraduationCap className="w-5 h-5" />}
            title="Question Vault"
            desc="Explore real past papers with industry relevance mapping."
            href="/papers"
            active
          />
        </div>
      </div>

      <footer className="py-10 text-center border-t border-border dark:border-slate-900 bg-secondary/30 dark:bg-slate-950/50">
        <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-2">System Status: Operational</p>
        <p className="text-muted-foreground text-xs italic">Built with love for high-performance learners in India 🇮🇳</p>
      </footer>
    </main>
  )
}

function LinkButton({ icon, title, desc, href, active = false }: { icon: any, title: string, desc: string, href: string, active?: boolean }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(href)}
      className={`tech-card p-6 text-left group hover:-translate-y-1 transition-all ${active ? 'border-blue-500/40 bg-blue-500/5' : ''}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${active ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-secondary dark:bg-slate-800 text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
        {icon}
      </div>
      <h4 className="font-bold text-foreground dark:text-slate-200 mb-1 flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </button>
  )
}
