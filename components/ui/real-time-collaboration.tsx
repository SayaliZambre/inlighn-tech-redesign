"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, MessageSquare, Video, Share2, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface CollaboratorData {
  id: string
  name: string
  avatar: string
  status: "online" | "coding" | "reviewing" | "away"
  cursor: { x: number; y: number }
  currentFile: string
}

const mockCollaborators: CollaboratorData[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "coding",
    cursor: { x: 45, y: 60 },
    currentFile: "main.js",
  },
  {
    id: "2",
    name: "Alex Kumar",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "reviewing",
    cursor: { x: 70, y: 30 },
    currentFile: "styles.css",
  },
  {
    id: "3",
    name: "Maria Garcia",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    cursor: { x: 25, y: 80 },
    currentFile: "index.html",
  },
]

export function RealTimeCollaboration() {
  const [collaborators, setCollaborators] = useState<CollaboratorData[]>(mockCollaborators)
  const [isActive, setIsActive] = useState(false)
  const [messages, setMessages] = useState([
    { id: "1", user: "Sarah Chen", message: "Working on the authentication logic", time: "2m ago" },
    { id: "2", user: "Alex Kumar", message: "The CSS animations look great!", time: "5m ago" },
    { id: "3", user: "Maria Garcia", message: "Just joined the session", time: "8m ago" },
  ])

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCollaborators((prev) =>
          prev.map((collab) => ({
            ...collab,
            cursor: {
              x: Math.max(10, Math.min(90, collab.cursor.x + (Math.random() - 0.5) * 10)),
              y: Math.max(10, Math.min(90, collab.cursor.y + (Math.random() - 0.5) * 10)),
            },
          })),
        )
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "coding":
        return "bg-blue-500"
      case "reviewing":
        return "bg-yellow-500"
      case "away":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "coding":
        return "Coding"
      case "reviewing":
        return "Reviewing"
      case "away":
        return "Away"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Real-Time Collaboration</h3>
          <p className="text-gray-300">Code together, learn together</p>
        </div>
        <motion.button
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          }`}
          onClick={() => setIsActive(!isActive)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? "Leave Session" : "Join Session"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor Simulation */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm text-gray-400">collaborative-editor.js</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">{collaborators.length} active</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm relative h-64 overflow-hidden">
            <div className="space-y-2">
              <div className="text-purple-400">// Real-time collaborative coding</div>
              <div className="text-blue-400">
                function <span className="text-yellow-400">initializeCollaboration</span>() {"{"}
              </div>
              <div className="ml-4 text-green-400">const socket = io.connect('/collaboration');</div>
              <div className="ml-4 text-green-400">socket.on('user-joined', handleUserJoin);</div>
              <div className="ml-4 text-green-400">socket.on('code-change', syncCodeChanges);</div>
              <div className="text-blue-400">{"}"}</div>
              <div className="text-gray-500">// More collaborative features...</div>
            </div>

            {/* Collaborative Cursors */}
            <AnimatePresence>
              {isActive &&
                collaborators.map((collab) => (
                  <motion.div
                    key={collab.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${collab.cursor.x}%`,
                      top: `${collab.cursor.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="flex items-center space-x-1">
                      <div className="w-0.5 h-4 bg-blue-500"></div>
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {collab.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Collaboration Panel */}
        <div className="space-y-4">
          {/* Active Users */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Collaborators
            </h4>
            <div className="space-y-3">
              {collaborators.map((collab) => (
                <motion.div
                  key={collab.id}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collab.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {collab.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(collab.status)} rounded-full border-2 border-slate-800`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collab.name}</p>
                    <p className="text-xs text-gray-400">{collab.currentFile}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getStatusText(collab.status)}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Team Chat
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-blue-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-gray-300 mt-1">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h4 className="font-semibold mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition-colors">
                <Video className="h-3 w-3" />
                <span>Video Call</span>
              </button>
              <button className="flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors">
                <Share2 className="h-3 w-3" />
                <span>Share Screen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <span>Connected to collaboration server</span>
        <Zap className="h-4 w-4" />
      </div>
    </div>
  )
}
