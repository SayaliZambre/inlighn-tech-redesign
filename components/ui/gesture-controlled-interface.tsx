"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Hand, Zap, Eye, Cpu } from "lucide-react"

export function GestureControlledInterface() {
  const [isActive, setIsActive] = useState(false)
  const [gesture, setGesture] = useState<string>("")
  const [confidence, setConfidence] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-300, 300], [30, -30])
  const rotateY = useTransform(x, [-300, 300], [-30, 30])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      x.set(event.clientX - centerX)
      y.set(event.clientY - centerY)
    }

    if (isActive) {
      window.addEventListener("mousemove", handleMouseMove)

      // Simulate gesture recognition
      const interval = setInterval(() => {
        const gestures = ["👋 Wave", "👆 Point", "✋ Stop", "👍 Thumbs Up", "✌️ Peace"]
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)]
        const randomConfidence = Math.floor(Math.random() * 40) + 60

        setGesture(randomGesture)
        setConfidence(randomConfidence)
      }, 2000)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        clearInterval(interval)
      }
    }
  }, [isActive, x, y])

  return (
    <div className="relative p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Gesture Control Interface</h3>
          <p className="text-gray-300">Experience the future of human-computer interaction</p>
        </div>

        <div ref={containerRef} className="relative h-80 flex items-center justify-center">
          <motion.div
            className="relative"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Main Interface Panel */}
            <motion.div
              className="w-80 h-60 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 relative overflow-hidden"
              animate={{
                boxShadow: isActive
                  ? "0 0 50px rgba(59, 130, 246, 0.5), inset 0 0 50px rgba(59, 130, 246, 0.1)"
                  : "0 0 20px rgba(59, 130, 246, 0.2)",
              }}
            >
              {/* Scanning lines */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-4"
                  animate={{
                    y: [0, 240, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              )}

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Eye className="h-8 w-8 text-white" />
                      </motion.div>
                    ) : (
                      <Hand className="h-8 w-8 text-white" />
                    )}
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-2">
                    {isActive ? "Gesture Recognition Active" : "Gesture Control Ready"}
                  </h4>

                  {isActive && gesture && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-2"
                    >
                      <p className="text-cyan-300 text-xl font-mono">{gesture}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-gray-300 text-sm">Confidence: {confidence}%</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Cpu className="h-4 w-4" />
                    <span className="text-sm">AI Powered</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Real-time</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="text-center">
          <motion.button
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              isActive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            }`}
            onClick={() => setIsActive(!isActive)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive ? "Stop Recognition" : "Start Gesture Control"}
          </motion.button>

          <p className="text-gray-400 text-sm mt-4">
            {isActive
              ? "Move your mouse to simulate gesture tracking"
              : "Click to activate advanced gesture recognition"}
          </p>
        </div>
      </div>
    </div>
  )
}
