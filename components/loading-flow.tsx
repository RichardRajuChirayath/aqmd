"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, Search, Brain, Zap, Sparkles } from "lucide-react"

const steps = [
    { id: 1, label: "Establishing connection to Assessor AI...", icon: Zap },
    { id: 2, label: "Deconstructing question intent...", icon: Search },
    { id: 3, label: "Evaluating student response alignment...", icon: Brain },
    { id: 4, label: "Identifying potential misconceptions...", icon: Sparkles },
    { id: 5, label: "Synthesizing feedback report...", icon: CheckCircle2 },
]

export function LoadingFlow() {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 min-h-[400px]">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-4 bg-primary/10 rounded-full blur-xl"
                />
            </div>

            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-1">
                    <h3 className="text-xl font-serif font-semibold">Analyzing Intent</h3>
                    <p className="text-sm text-muted-foreground">Our AI is meticulously reviewing the alignment.</p>
                </div>

                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = index === currentStep
                        const isCompleted = index < currentStep

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: isActive || isCompleted ? 1 : 0.3, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <div className={`p-2 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                </div>
                                <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="dot"
                                        className="w-1 h-1 bg-primary rounded-full ml-auto"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity }}
                                    />
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
