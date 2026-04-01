"use client"

import { Canvas } from "@react-three/fiber"
import { Float, Environment, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function FloatingOrb({ position, color, speed = 1, distort = 0.3, scale = 1 }: {
  position: [number, number, number]
  color: string
  speed?: number
  distort?: number
  scale?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[100, 100, "#1a365d", "#0d1b2a"]}
      position={[0, -3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const particleCount = 500
  
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 30
    positions[i + 1] = (Math.random() - 0.5) * 30
    positions[i + 2] = (Math.random() - 0.5) * 30
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02
      points.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4fd1c5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#4fd1c5" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#805ad5" />
      
      <FloatingOrb position={[-4, 1, -2]} color="#4fd1c5" speed={1.2} distort={0.4} scale={1.5} />
      <FloatingOrb position={[4, -1, -3]} color="#805ad5" speed={0.8} distort={0.3} scale={1.2} />
      <FloatingOrb position={[0, 2, -4]} color="#38b2ac" speed={1} distort={0.5} scale={0.8} />
      <FloatingOrb position={[-2, -2, -1]} color="#4299e1" speed={1.5} distort={0.2} scale={0.6} />
      <FloatingOrb position={[3, 1.5, -2]} color="#9f7aea" speed={0.9} distort={0.35} scale={0.9} />
      
      <ParticleField />
      <GridFloor />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      
      <Environment preset="night" />
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
    </div>
  )
}
