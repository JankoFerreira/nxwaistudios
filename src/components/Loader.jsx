import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './Loader.css'

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const mountRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase(1), 520)
          setTimeout(() => setPhase(2), 1450)
          return 100
        }
        const increment = prev < 68 ? Math.random() * 5 + 1.8 : Math.random() * 1.7 + 0.55
        return Math.min(100, prev + increment)
      })
    }, 74)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isSmall = window.matchMedia('(max-width: 760px)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6.35)

    const renderer = new THREE.WebGLRenderer({ antialias: !isSmall, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1 : 1.45))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    group.position.x = -7
    group.rotation.set(0.6, -1.8, -0.5)
    group.scale.setScalar(0.9)
    scene.add(group)

    const ringGeo = new THREE.TorusGeometry(1.55, 0.085, isSmall ? 14 : 18, isSmall ? 90 : 136)
    const ringMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCyan: { value: new THREE.Color(0x00f5ff) },
        uPurple: { value: new THREE.Color(0xa855f7) },
        uIce: { value: new THREE.Color(0xd7f8ff) },
        uEnergy: { value: 0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uEnergy;
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          vec3 pos = position;
          pos += normal * sin(pos.x * 5.0 + pos.y * 3.0 + uTime * 1.2) * (0.012 + uEnergy * 0.025);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uCyan;
        uniform vec3 uPurple;
        uniform vec3 uIce;
        uniform float uEnergy;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vec3 normal = normalize(vNormal);
          float latticeA = abs(sin(vUv.x * 110.0 + sin(vPosition.y * 3.0) * 2.0));
          float latticeB = abs(sin(vUv.y * 46.0 + vUv.x * 12.0 - uTime * 0.42));
          float cells = min(latticeA, latticeB);
          float struts = smoothstep(0.06, 0.17, cells);
          if (struts < 0.18) discard;

          float rim = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.1);
          float accent = sin(vPosition.y * 2.4 + uTime * 0.7) * 0.5 + 0.5;
          float sweep = smoothstep(0.9, 1.0, sin(vPosition.x * 2.2 + vPosition.y * 1.5 - uTime * 1.2));
          vec3 glow = mix(uCyan, uPurple, accent);
          vec3 darkMetal = vec3(0.012, 0.016, 0.023);
          vec3 color = mix(darkMetal, glow, rim * 0.9);
          color += glow * pow(struts, 2.0) * 0.16;
          color += uIce * sweep * (0.28 + rim * 0.52 + uEnergy * 0.22);
          gl_FragColor = vec4(color, 0.96);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    group.add(ring)

    const innerGeo = new THREE.TorusGeometry(1.18, 0.018, 8, 96)
    const cyanMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0x00f5ff) },
        uColorB: { value: new THREE.Color(0xd7f8ff) },
        uOpacity: { value: 0.54 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uOpacity;
        void main() {
          float sweep = smoothstep(0.86, 1.0, sin(vUv.x * 28.0 - uTime * 1.4));
          vec3 color = mix(uColorA, uColorB, sweep);
          gl_FragColor = vec4(color, uOpacity + sweep * 0.24);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const innerRing = new THREE.Mesh(innerGeo, cyanMat)
    group.add(innerRing)

    const outerGeo = new THREE.TorusGeometry(1.86, 0.014, 8, 112)
    const purpleMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0xa855f7) },
        uColorB: { value: new THREE.Color(0x00f5ff) },
        uOpacity: { value: 0.36 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uOpacity;
        void main() {
          float dash = smoothstep(0.28, 0.5, abs(sin(vUv.x * 36.0 + uTime * 0.8)));
          float sweep = smoothstep(0.9, 1.0, sin(vUv.x * 18.0 + uTime * 1.1));
          vec3 color = mix(uColorA, uColorB, sweep);
          gl_FragColor = vec4(color, (uOpacity + sweep * 0.22) * dash);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const outerRing = new THREE.Mesh(outerGeo, purpleMat)
    outerRing.rotation.x = Math.PI * 0.5
    group.add(outerRing)

    const nodeGeo = new THREE.SphereGeometry(0.055, 12, 8)
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.82,
    })
    const nodes = []
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 1.55, 0)
      group.add(node)
      nodes.push(node)
    }

    const ambient = new THREE.AmbientLight(0xd7f8ff, 1.2)
    scene.add(ambient)

    const cyanLight = new THREE.PointLight(0x00f5ff, 7, 18)
    cyanLight.position.set(2.8, 2.5, 3.5)
    scene.add(cyanLight)

    const purpleLight = new THREE.PointLight(0xa855f7, 5, 16)
    purpleLight.position.set(-3, -1.8, 3)
    scene.add(purpleLight)

    let resizeRaf = null
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        camera.aspect = mount.clientWidth / mount.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mount.clientWidth, mount.clientHeight)
      })
    }

    window.addEventListener('resize', onResize)

    let raf = null
    const start = performance.now()
    const animate = (now) => {
      const elapsed = (now - start) / 1000
      const travel = Math.min(elapsed / 1.8, 1)
      const easedTravel = 1 - Math.pow(1 - travel, 3)
      const settle = Math.max(0, Math.min((elapsed - 1.8) / 1.2, 1))
      const settleEase = settle < 0.5 ? 4 * settle * settle * settle : 1 - Math.pow(-2 * settle + 2, 3) / 2
      const exit = Math.max(0, Math.min((elapsed - 3.22) / 0.5, 1))

      group.position.x = -7 + 7 * easedTravel
      group.position.y = Math.sin(easedTravel * Math.PI) * 0.22
      group.rotation.y += 0.19 * (1 - easedTravel) + 0.015
      group.rotation.x += 0.08 * (1 - easedTravel) + 0.006
      group.rotation.z += 0.16 * (1 - easedTravel) + 0.008

      const settlePulse = 1 + Math.sin(elapsed * 7) * 0.025 * settleEase
      const exitScale = 1 + exit * 0.28
      group.scale.setScalar(0.9 * settlePulse * exitScale)
      group.position.z = -exit * 0.8

      innerRing.rotation.z = -elapsed * 0.42
      outerRing.rotation.y = elapsed * 0.35
      ringMat.uniforms.uTime.value = elapsed
      ringMat.uniforms.uEnergy.value += (settleEase - ringMat.uniforms.uEnergy.value) * 0.08
      cyanMat.uniforms.uTime.value = elapsed
      cyanMat.uniforms.uOpacity.value = 0.44 + settleEase * 0.18
      purpleMat.uniforms.uTime.value = elapsed
      purpleMat.uniforms.uOpacity.value = 0.28 + settleEase * 0.12
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(elapsed * 4 + index) * 0.16)
      })

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className={`loader ${phase === 1 ? 'loader--settled' : ''} ${phase === 2 ? 'loader--exit' : ''}`}>
      <div className="loader__bg" />
      <div className="loader__scene" ref={mountRef} aria-hidden="true" />

      <div className="loader__mark" aria-label="NXW loading">
        <div className="loader__letters" aria-hidden="true">
          <span className="loader__letter loader__letter--n">N</span>
          <span className="loader__letter loader__letter--x">X</span>
          <span className="loader__letter loader__letter--w">W</span>
        </div>
      </div>

      <div className="loader__hud">
        <div className="loader__bar-wrap">
          <div className="loader__bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader__meta">
          <span>{String(Math.round(progress)).padStart(3, '0')}</span>
          <span>Building Interface</span>
        </div>
      </div>
    </div>
  )
}
