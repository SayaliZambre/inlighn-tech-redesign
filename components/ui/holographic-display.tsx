"use client"

import type React from "react"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Plane } from "@react-three/drei"
import * as THREE from "three"

function HologramShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 uv = vUv;
      
      // Holographic scan lines
      float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;
      
      // Holographic flicker
      float flicker = sin(time * 15.0) * 0.02 + 0.98;
      
      // Edge glow
      float edge = 1.0 - smoothstep(0.0, 0.1, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
      
      // Noise
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;
      
      vec3 finalColor = color + scanline + noise;
      float alpha = (0.3 + edge * 0.7) * flicker;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) },
      }}
      transparent
      side={THREE.DoubleSide}
    />
  )
}

function HolographicPanel({
  position,
  rotation,
  children,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  children: React.ReactNode
}) {
  return (
    <group position={position} rotation={rotation}>
      <Plane args={[4, 3]}>
        <HologramShader />
      </Plane>
      <group position={[0, 0, 0.01]}>{children}</group>
    </group>
  )
}

export function HolographicDisplay() {
  return (
    <div className="w-full h-96 bg-black rounded-2xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ffff" />

        {/* Main display panel */}
        <HolographicPanel position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <Text position={[0, 1, 0]} fontSize={0.3} color="#00ffff" anchorX="center" anchorY="middle">
            INLIGHN TECH SYSTEMS
          </Text>
          <Text position={[0, 0.3, 0]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
            Next-Generation Learning Platform
          </Text>
          <Text position={[0, -0.2, 0]} fontSize={0.12} color="#00ff00" anchorX="center" anchorY="middle">
            ▶ CYBERSECURITY PROTOCOLS: ACTIVE
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.12} color="#00ff00" anchorX="center" anchorY="middle">
            ▶ AI LEARNING ENGINE: ONLINE
          </Text>
          <Text position={[0, -0.6, 0]} fontSize={0.12} color="#00ff00" anchorX="center" anchorY="middle">
            ▶ STUDENT NETWORK: 5000+ CONNECTED
          </Text>
        </HolographicPanel>

        {/* Side panels */}
        <HolographicPanel position={[-3, 0, -1]} rotation={[0, 0.3, 0]}>
          <Text position={[0, 0.5, 0]} fontSize={0.2} color="#ff6b6b" anchorX="center" anchorY="middle">
            SECURITY
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
            Ethical Hacking
          </Text>
          <Text position={[0, -0.2, 0]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
            Network Defense
          </Text>
        </HolographicPanel>

        <HolographicPanel position={[3, 0, -1]} rotation={[0, -0.3, 0]}>
          <Text position={[0, 0.5, 0]} fontSize={0.2} color="#4ecdc4" anchorX="center" anchorY="middle">
            DATA SCI
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
            Machine Learning
          </Text>
          <Text position={[0, -0.2, 0]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
            Data Analysis
          </Text>
        </HolographicPanel>
      </Canvas>

      {/* Overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    </div>
  )
}
