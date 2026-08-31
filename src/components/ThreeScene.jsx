import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function ThreeScene({ loaded }) {
  const mountRef = useRef(null)
  const rafRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())
  const torusRef = useRef(null)
  const torusEdgeRef = useRef(null)
  const gridRef = useRef(null)
  const fieldRef = useRef(null)
  const haloRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetCamRef = useRef({ x: 0, y: 0, z: 0 })
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (!loaded) return
    const mount = mountRef.current
    if (!mount) return

    if (!supportsWebGL()) {
      setFallback(true)
      return
    }

    const isSmall = window.matchMedia('(max-width: 760px)').matches
    const isCoarse = window.matchMedia(
      '(hover: none), (pointer: coarse)'
    ).matches
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const enableEnhancedWorld = !isSmall && !isCoarse && !prefersReducedMotion
    const pixelRatioCap = isSmall ? 1 : 1.45
    const mobileSceneScale = isSmall ? 0.48 : 1

    // 3D scene setup: restore the original premium dark WebGL world and keep
    // the existing hero TorusKnot design intact.
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0c1220, 0.035)

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    )
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSmall,
      alpha: true,
    })
    // Performance settings: cap DPR exactly as requested, and reduce antialias
    // work on smaller screens.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x0c1220, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x0a0e1a, 3)
    scene.add(ambientLight)

    const cyanLight = new THREE.PointLight(0x00f5ff, 8, 30)
    cyanLight.position.set(5, 5, 5)
    scene.add(cyanLight)

    const purpleLight = new THREE.PointLight(0xa855f7, 6, 25)
    purpleLight.position.set(-5, -3, 3)
    scene.add(purpleLight)

    const orangeLight = new THREE.PointLight(0xff9a3d, 1.4, 24)
    orangeLight.position.set(0, -4, 2)
    scene.add(orangeLight)

    const sectionPalette = [
      new THREE.Color(0x00f5ff),
      new THREE.Color(0x9bd8ff),
      new THREE.Color(0x8ff0c8),
      new THREE.Color(0xffb86b),
      new THREE.Color(0xd7f8ff),
    ]
    const workPalette = [
      new THREE.Color(0x00f5ff),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x7ef7c9),
      new THREE.Color(0xff9a3d),
    ]

    // Keep the original hero TorusKnot object and shader treatment.
    const torusGeo = new THREE.TorusKnotGeometry(
      1.38,
      0.34,
      isSmall ? 96 : 180,
      isSmall ? 14 : 22,
      2,
      3
    )
    const torusMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCyan: { value: new THREE.Color(0x00f5ff) },
        uPurple: { value: new THREE.Color(0xa855f7) },
        uAccent: { value: new THREE.Color(0x00f5ff) },
        uSection: { value: 0 },
        uEnergy: { value: 0 },
      },
      vertexShader: `
        varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uEnergy;
          uniform float uSection;
          void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          vec3 pos = position;
          float sectionWave = sin((pos.x + pos.y + pos.z) * (2.4 + uSection * 0.22) + uTime * 0.8);
          pos += normal * (sin(pos.x * 4.0 + pos.y * 2.0 + uTime) * 0.022 + sectionWave * uEnergy * 0.045);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uCyan;
        uniform vec3 uPurple;
        uniform vec3 uAccent;
        uniform float uSection;
        uniform float uEnergy;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vec3 normal = normalize(vNormal);
          float latticeA = abs(sin(vUv.x * 88.0 + sin(vPosition.y * 3.0) * 2.0));
          float latticeB = abs(sin((vUv.y * 34.0) + (vUv.x * 17.0) - uTime * 0.22));
          float latticeC = abs(sin((vUv.x + vUv.y) * 54.0 + vPosition.z * 2.0));
          float cells = min(min(latticeA, latticeB), latticeC);
          float struts = smoothstep(0.08, 0.19, cells);
          if (struts < 0.18) discard;

          float rim = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.4);
          float accent = sin(vPosition.y * 2.0 + uTime * 0.35) * 0.5 + 0.5;
          float sweep = smoothstep(0.88, 1.0, sin(vPosition.x * 1.8 + vPosition.y * 1.15 + vPosition.z * 1.4 - uTime * 0.85));
          vec3 glow = mix(mix(uCyan, uPurple, accent), uAccent, 0.26 + uEnergy * 0.32);
          vec3 darkMetal = vec3(0.014, 0.017, 0.022);
          vec3 color = mix(darkMetal, glow, rim * 0.85);
          color += glow * pow(struts, 2.0) * 0.12;
          color += mix(vec3(1.0), uCyan, 0.45) * sweep * (0.35 + rim * 0.45);
          color += uAccent * smoothstep(0.68, 1.0, sin(uTime * 0.9 + vPosition.y * 4.0 + uSection)) * uEnergy * 0.16;
          gl_FragColor = vec4(color, 0.96);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(0, 0, 0)
    scene.add(torus)
    torusRef.current = torus

    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    })
    const edgeGlow = new THREE.Mesh(torusGeo, edgeMat)
    edgeGlow.scale.setScalar(1.006)
    torus.add(edgeGlow)
    torusEdgeRef.current = edgeGlow

    // Restore the original bottom grid blanket under the hero.
    const gridGeo = new THREE.PlaneGeometry(
      60,
      60,
      isSmall ? 24 : 40,
      isSmall ? 24 : 40
    )
    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCyan: { value: new THREE.Color(0x00f5ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 0.5 + uTime * 0.3) * cos(pos.y * 0.5 + uTime * 0.2) * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uCyan;
        void main() {
          vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
          float lines = min(grid.x, grid.y);
          float alpha = 1.0 - min(lines, 1.0);
          alpha *= 0.25;
          float dist = length(vUv - 0.5) * 2.0;
          alpha *= 1.0 - dist;
          gl_FragColor = vec4(uCyan, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    const grid = new THREE.Mesh(gridGeo, gridMat)
    grid.rotation.x = -Math.PI / 2
    grid.position.set(0, -8, -22)
    scene.add(grid)
    gridRef.current = grid

    if (enableEnhancedWorld) {
      const fieldCount = 72
      const fieldGeo = new THREE.BufferGeometry()
      const positions = new Float32Array(fieldCount * 3)
      const sizes = new Float32Array(fieldCount)
      for (let i = 0; i < fieldCount; i += 1) {
        const radius = 10 + Math.random() * 34
        const angle = Math.random() * Math.PI * 2
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18
        positions[i * 3 + 2] = -Math.random() * 58
        sizes[i] = Math.random() * 1.4 + 0.5
      }
      fieldGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      fieldGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
      const fieldMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAccent: { value: new THREE.Color(0x00f5ff) },
          uOpacity: { value: 0.24 },
        },
        vertexShader: `
          attribute float aSize;
          uniform float uTime;
          varying float vFade;
          void main() {
            vec3 pos = position;
            pos.x += sin(uTime * 0.13 + position.z * 0.08) * 0.32;
            pos.y += cos(uTime * 0.14 + position.x * 0.08) * 0.22;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aSize * (220.0 / -mvPosition.z);
            vFade = smoothstep(-64.0, -8.0, pos.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uAccent;
          uniform float uOpacity;
          varying float vFade;
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * vFade;
            gl_FragColor = vec4(uAccent, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const field = new THREE.Points(fieldGeo, fieldMat)
      scene.add(field)
      fieldRef.current = field

      const haloGeo = new THREE.IcosahedronGeometry(2.35, 1)
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
      })
      const halo = new THREE.Mesh(haloGeo, haloMat)
      halo.position.set(0, 0, -0.4)
      scene.add(halo)
      haloRef.current = halo
    }

    let resizeRaf = null
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        camera.aspect = mount.clientWidth / mount.clientHeight
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
        renderer.setSize(mount.clientWidth, mount.clientHeight)
      })
    }
    window.addEventListener('resize', onResize)

    const onPointerMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (event.clientY / window.innerHeight - 0.5) * -2
    }
    if (enableEnhancedWorld) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    let lastSmallFrame = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      if (document.hidden) return
      const t = clockRef.current.getElapsedTime()
      if (isSmall && t - lastSmallFrame < 1 / 30) return
      if (isSmall) lastSmallFrame = t
      const sp = window._nxwScrollProgress || 0
      const finale = window._nxwFinaleProgress || 0
      const sectionIndex = Math.max(
        0,
        Math.min(4, window._nxwActiveSectionIndex || 0)
      )
      const activeWork = Math.max(0, Math.min(3, window._nxwActiveWork || 0))
      const sectionAccent =
        sectionIndex === 3
          ? workPalette[activeWork]
          : sectionPalette[sectionIndex]
      const sectionEnergy = Math.min(
        1,
        Math.abs(Math.sin(sp * Math.PI * 2.5)) * 0.45 +
          sectionIndex * 0.11 +
          finale * 0.35
      )
      const finaleEase =
        finale < 0.5
          ? 4 * finale * finale * finale
          : 1 - Math.pow(-2 * finale + 2, 3) / 2
      if (torusRef.current) {
        torusRef.current.material.uniforms.uTime.value = t
        torusRef.current.material.uniforms.uAccent.value.lerp(
          sectionAccent,
          0.045
        )
        torusRef.current.material.uniforms.uSection.value +=
          (sectionIndex - torusRef.current.material.uniforms.uSection.value) *
          0.04
        torusRef.current.material.uniforms.uEnergy.value +=
          (sectionEnergy - torusRef.current.material.uniforms.uEnergy.value) *
          0.035
        torusRef.current.rotation.x =
          t * (0.06 + finaleEase * 0.1) + sp * 0.42 + mouseRef.current.y * 0.08
        torusRef.current.rotation.y =
          t * (0.085 + finaleEase * 0.12) + mouseRef.current.x * 0.12
        torusRef.current.rotation.z = t * 0.035
        const sectionScale =
          1 +
          sectionIndex * 0.025 +
          (sectionIndex === 3 ? activeWork * 0.015 : 0)
        torusRef.current.scale.setScalar(
          ((1 + sp * 0.42) * sectionScale * (1 - finaleEase) +
            0.68 * finaleEase) *
            mobileSceneScale
        )
        torusRef.current.visible = sp < 0.35 || finale > 0.01
      }
      if (torusEdgeRef.current) {
        torusEdgeRef.current.material.opacity = 0.07
      }
      if (gridRef.current) {
        gridRef.current.material.uniforms.uTime.value = t
        gridRef.current.rotation.z = sp * 0.12 + mouseRef.current.x * 0.015
      }
      if (fieldRef.current) {
        fieldRef.current.material.uniforms.uTime.value = t
        fieldRef.current.material.uniforms.uAccent.value.lerp(
          sectionAccent,
          0.04
        )
        fieldRef.current.rotation.y = t * 0.012 + mouseRef.current.x * 0.025
        fieldRef.current.rotation.x = mouseRef.current.y * 0.018
      }
      if (haloRef.current) {
        haloRef.current.material.color.lerp(sectionAccent, 0.04)
        haloRef.current.rotation.x = -t * 0.035 + sp * 0.5
        haloRef.current.rotation.y = t * 0.05 + mouseRef.current.x * 0.18
        haloRef.current.scale.setScalar(
          1 + sectionEnergy * 0.18 + finaleEase * 0.3
        )
        haloRef.current.visible = !isSmall || finale > 0.01
      }

      const scrollCamX =
        Math.sin(sp * Math.PI * 1.7) * 2.2 + mouseRef.current.x * 0.18
      const scrollCamY =
        Math.sin(sp * Math.PI * 2.2) * 1.4 - sp * 3 + mouseRef.current.y * 0.1
      const scrollCamZ = 6 - sp * 72 + Math.sin(sp * Math.PI * 2) * 2.4
      const camX = scrollCamX * (1 - finaleEase)
      const camY = scrollCamY * (1 - finaleEase)
      const camZ = scrollCamZ * (1 - finaleEase) + 6.2 * finaleEase

      targetCamRef.current.x += (camX - targetCamRef.current.x) * 0.04
      targetCamRef.current.y += (camY - targetCamRef.current.y) * 0.06
      targetCamRef.current.z += (camZ - targetCamRef.current.z) * 0.06

      camera.position.set(
        targetCamRef.current.x,
        targetCamRef.current.y,
        targetCamRef.current.z
      )
      camera.lookAt(
        targetCamRef.current.x * 0.3,
        targetCamRef.current.y,
        targetCamRef.current.z - 10
      )

      cyanLight.position.x = camera.position.x + 5
      cyanLight.position.y = camera.position.y + 5
      purpleLight.position.x = camera.position.x - 5
      purpleLight.position.y = camera.position.y - 3
      orangeLight.intensity = 1.4 + Math.sin(t * 1.5) * 0.8

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      if (enableEnhancedWorld) {
        window.removeEventListener('pointermove', onPointerMove)
      }
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) {
          if (Array.isArray(child.material))
            child.material.forEach((mat) => mat.dispose())
          else child.material.dispose()
        }
      })
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [loaded])

  return (
    <div id="canvas-container" ref={mountRef}>
      {fallback && <div className="webgl-fallback" />}
    </div>
  )
}
