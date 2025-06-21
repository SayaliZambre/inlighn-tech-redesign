"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Sphere, Line } from "@react-three/drei"
import { useRef, useState, Suspense } from "react"
import { motion } from "framer-motion"
import { Vector3 } from "three"
import type * as THREE from "three"

interface SkillNode {
  id: string
  title: string
  position: [number, number, number]
  color: string
  completed: boolean
  connections: string[]
  description: string
}

const skillNodes: SkillNode[] = [
  {
    id: "html",
    title: "HTML",
    position: [-4, 0, 0],
    color: "#e34c26",
    completed: true,
    connections: ["css", "javascript"],
    description: "Foundation of web development",
  },
  {
    id: "css",
    title: "CSS",
    position: [-2, 2, 0],
    color: "#1572b6",
    completed: true,
    connections: ["javascript", "react"],
    description: "Styling and layout",
  },
  {
    id: "javascript",
    title: "JavaScript",
    position: [0, 0, 0],
    color: "#f7df1e",
    completed: true,
    connections: ["react", "nodejs", "typescript"],
    description: "Programming language of the web",
  },
  {
    id: "react",
    title: "React",
    position: [2, 2, 0],
    color: "#61dafb",
    completed: false,
    connections: ["nextjs", "typescript"],
    description: "Modern UI library",
  },
  {
    id: "nodejs",
    title: "Node.js",
    position: [2, -2, 0],
    color: "#339933",
    completed: false,
    connections: ["express", "database"],
    description: "Server-side JavaScript",
  },
  {
    id: "typescript",
    title: "TypeScript",
    position: [4, 0, 0],
    color: "#3178c6",
    completed: false,
    connections: ["nextjs"],
    description: "Typed JavaScript",
  },
  {
    id: "nextjs",
    title: "Next.js",
    position: [6, 1, 0],
    color: "#000000",
    completed: false,
    connections: [],
    description: "Full-stack React framework",
  },
  {
    id: "express",
    title: "Express",
    position: [4, -2, 0],
    color: "#000000",
    completed: false,
    connections: ["database"],
    description: "Web framework for Node.js",
  },
  {
    id: "database",
    title: "Database",
    position: [6, -1, 0],
    color: "#336791",
    completed: false,
    connections: [],
    description: "Data storage and management",
  },
]

function SkillNodeComponent({
  node,
  onSelect,
  isSelected,
}: {
  node: SkillNode
  onSelect: (node: SkillNode) => void
  isSelected: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.2)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(node)}
      >
        <meshStandardMaterial
          color={node.color}
          emissive={node.completed ? node.color : "#000000"}
          emissiveIntensity={node.completed ? 0.2 : 0}
          opacity={node.completed ? 1 : 0.6}
          transparent
        />
      </Sphere>
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color={node.completed ? "#ffffff" : "#888888"}
        anchorX="center"
        anchorY="middle"
      >
        {node.title}
      </Text>
    </group>
  )
}

function ConnectionLines({ nodes }: { nodes: SkillNode[] }) {
  const lines = []

  for (const node of nodes) {
    for (const connectionId of node.connections) {
      const connectedNode = nodes.find((n) => n.id === connectionId)
      if (connectedNode) {
        lines.push(
          <Line
            key={`${node.id}-${connectionId}`}
            points={[new Vector3(...node.position), new Vector3(...connectedNode.position)]}
            color={node.completed && connectedNode.completed ? "#00ff00" : "#666666"}
            lineWidth={2}
          />,
        )
      }
    }
  }

  return <>{lines}</>
}

export function Interactive3DSkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <motion.button
        className="mb-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isVisible ? "Hide" : "Explore"} 3D Learning Path
      </motion.button>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 600 }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden"
        >
          <div className="flex h-full">
            {/* 3D Canvas */}
            <div className="flex-1 h-full">
              <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <ConnectionLines nodes={skillNodes} />
                  {skillNodes.map((node) => (
                    <SkillNodeComponent
                      key={node.id}
                      node={node}
                      onSelect={setSelectedNode}
                      isSelected={selectedNode?.id === node.id}
                    />
                  ))}
                  <OrbitControls enableZoom={true} enablePan={true} />
                </Suspense>
              </Canvas>
            </div>

            {/* Info Panel */}
            <div className="w-80 bg-slate-800 p-6 border-l border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Learning Path</h3>
              {selectedNode ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">{selectedNode.title}</h4>
                    <p className="text-gray-300 text-sm mb-3">{selectedNode.description}</p>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${selectedNode.completed ? "bg-green-500" : "bg-gray-500"}`}
                      />
                      <span className="text-sm text-gray-300">
                        {selectedNode.completed ? "Completed" : "Not Started"}
                      </span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    {selectedNode.completed ? "Review" : "Start Learning"}
                  </button>
                </motion.div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <p>Click on a skill node to see details</p>
                  <p className="text-sm mt-2">Drag to rotate • Scroll to zoom</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
