"use client"

import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

export default function ParticlesBg() {

  const particlesInit = async (engine: any) => {
    await loadFull(engine)
  }

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: { value: 40 },
          color: { value: "#d4af37" },
          size: { value: 2 },
          move: { enable: true, speed: 0.6 },
          opacity: { value: 0.4 }
        },
        background: { color: "transparent" }
      }}
    />
  )
}