import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const contactEmail = "hello@nxwb-studios.co.za";
const whatsappNumber = "27682712616";
const analyticsConfig = {
  googleAnalyticsId: "",
  microsoftClarityId: "",
};

const canvas = document.querySelector("#world");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const loader = document.querySelector("[data-loader]");
const loaderBar = document.querySelector("[data-loader-bar]");
const loaderProgress = document.querySelector("[data-loader-progress]");

document.body.classList.add("is-loading");

function initLoader() {
  if (!loader) return;

  let progress = 0;
  let finished = false;
  const interval = window.setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 11) + 7, 92);
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderProgress) loaderProgress.textContent = `${progress}%`;
  }, 140);

  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearInterval(interval);
    if (loaderBar) loaderBar.style.width = "100%";
    if (loaderProgress) loaderProgress.textContent = "100%";
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, 420);
    window.setTimeout(() => {
      loader.remove();
    }, 1200);
  };

  if (document.readyState === "complete") {
    window.setTimeout(finish, 650);
  } else {
    window.addEventListener("load", () => window.setTimeout(finish, 650), { once: true });
    window.setTimeout(finish, 2400);
  }
}

function supportsWebGL() {
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function initWorld() {
  if (!canvas || !supportsWebGL()) {
    document.body.classList.add("webgl-unavailable");
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0c1220, 0.03);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x070b13, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const cyanLight = new THREE.PointLight(0x00f5ff, 7, 28);
  cyanLight.position.set(5, 4, 5);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0xa855f7, 5, 24);
  purpleLight.position.set(-5, -2, 3);
  scene.add(purpleLight);

  scene.add(new THREE.AmbientLight(0x132033, 2.4));

  const geometry = new THREE.TorusKnotGeometry(1.45, 0.32, 160, 20, 2, 3);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCyan: { value: new THREE.Color(0x00f5ff) },
      uPurple: { value: new THREE.Color(0xa855f7) },
      uGreen: { value: new THREE.Color(0x7ef7c9) },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float uTime;

      void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        vec3 pos = position + normal * sin(position.x * 4.0 + position.y * 2.0 + uTime) * 0.025;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uCyan;
      uniform vec3 uPurple;
      uniform vec3 uGreen;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vec3 normal = normalize(vNormal);
        float latticeA = abs(sin(vUv.x * 84.0 + sin(vPosition.y * 2.6)));
        float latticeB = abs(sin(vUv.y * 38.0 - uTime * 0.22));
        float cells = min(latticeA, latticeB);
        float struts = smoothstep(0.08, 0.2, cells);
        if (struts < 0.18) discard;

        float rim = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.25);
        float sweep = smoothstep(0.88, 1.0, sin(vPosition.x * 1.7 + vPosition.y * 1.2 + vPosition.z * 1.4 - uTime * 0.82));
        vec3 glow = mix(uCyan, uPurple, sin(vPosition.y * 2.0 + uTime * 0.35) * 0.5 + 0.5);
        glow = mix(glow, uGreen, sweep * 0.35);
        vec3 color = mix(vec3(0.012, 0.016, 0.024), glow, rim * 0.9);
        color += glow * pow(struts, 2.0) * 0.14;
        color += uGreen * sweep * 0.35;
        gl_FragColor = vec4(color, 0.96);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const torus = new THREE.Mesh(geometry, material);
  torus.position.set(window.innerWidth < 900 ? 0.18 : 0, window.innerWidth < 900 ? -1.45 : -0.55, 0);
  scene.add(torus);

  const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.055,
  }));
  wire.scale.setScalar(1.01);
  torus.add(wire);

  const gridGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
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
        pos.z += sin(pos.x * 0.5 + uTime * 0.2) * cos(pos.y * 0.5 + uTime * 0.16) * 0.4;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 uCyan;
      void main() {
        vec2 grid = abs(fract(vUv * 22.0 - 0.5) - 0.5) / fwidth(vUv * 22.0);
        float lines = min(grid.x, grid.y);
        float alpha = 1.0 - min(lines, 1.0);
        alpha *= 0.2 * (1.0 - length(vUv - 0.5) * 1.6);
        gl_FragColor = vec4(uCyan, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.set(0, -7.5, -15);
  scene.add(grid);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * -2;
  }, { passive: true });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    torus.position.set(window.innerWidth < 900 ? 0.18 : 0, window.innerWidth < 900 ? -1.45 : -0.55, 0);
  }

  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (document.hidden) return;

    const time = clock.getElapsedTime();
    const scrollProgress = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1);
    root.style.setProperty("--depth-progress", scrollProgress.toFixed(4));

    material.uniforms.uTime.value = time;
    gridMat.uniforms.uTime.value = time;
    torus.rotation.x = time * 0.08 + scrollProgress * 1.45 + pointer.y * 0.08;
    torus.rotation.y = time * 0.105 + scrollProgress * 0.7 + pointer.x * 0.12;
    torus.rotation.z = time * 0.035 + scrollProgress * 0.32;
    torus.scale.setScalar(1 + scrollProgress * 0.28);
    torus.position.z = scrollProgress * -1.8;
    grid.rotation.z = scrollProgress * 0.24;
    grid.position.z = -15 + scrollProgress * 8;

    const targetX = pointer.x * 0.18;
    const targetY = pointer.y * 0.12 - scrollProgress * 0.35;
    const targetZ = 6 - scrollProgress * 1.9;
    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.position.z += (targetZ - camera.position.z) * 0.045;
    camera.lookAt(0, -0.25 - scrollProgress * 0.35, -8 - scrollProgress * 3.2);
    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    root.style.setProperty("--depth-progress", "0");
    renderer.render(scene, camera);
  } else {
    animate();
  }
}

function initDepthScroll() {
  const updateDepth = () => {
    const progress = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1);
    root.style.setProperty("--depth-progress", progress.toFixed(4));
  };

  updateDepth();
  window.addEventListener("scroll", updateDepth, { passive: true });
  window.addEventListener("resize", updateDepth);
}

function initChat() {
  const chat = document.querySelector(".chat");
  const launcher = document.querySelector("[data-chat-toggle]");
  const openers = document.querySelectorAll("[data-chat-open]");
  const close = document.querySelector("[data-chat-close]");
  const windowEl = document.querySelector(".chat__window");
  const form = document.querySelector("[data-chat-form]");
  const messages = document.querySelector("[data-chat-messages]");

  if (!chat || !launcher || !windowEl || !form || !messages) return;

  const setOpen = (isOpen) => {
    chat.classList.toggle("is-open", isOpen);
    launcher.setAttribute("aria-expanded", String(isOpen));
    windowEl.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      form.querySelector("input")?.focus();
    }
  };

  launcher.addEventListener("click", () => setOpen(!chat.classList.contains("is-open")));
  openers.forEach((button) => button.addEventListener("click", () => setOpen(true)));
  close?.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.elements.message;
    const text = input.value.trim();
    if (!text) return;

    const userMessage = document.createElement("p");
    userMessage.className = "message message--user";
    userMessage.textContent = text;
    messages.appendChild(userMessage);

    const agentMessage = document.createElement("p");
    agentMessage.className = "message message--agent";
    agentMessage.textContent = "Thanks. Your message is ready to send directly to NXW Studios.";
    messages.appendChild(agentMessage);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";

    const encodedText = encodeURIComponent(text);
    const target = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodedText}`
      : `mailto:${contactEmail}?subject=NXW%20Studios%20chat%20message&body=${encodedText}`;

    window.setTimeout(() => {
      window.open(target, "_blank", "noopener");
    }, 650);
  });
}

function initCustomCursor() {
  const canUseCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canUseCursor) return;

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const moveDot = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  };

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };

  const setHover = (isHovering) => {
    dot.classList.toggle("hover", isHovering);
    ring.classList.toggle("hover", isHovering);
  };

  window.addEventListener("pointermove", moveDot, { passive: true });
  document.querySelectorAll("a, button, input, .hoverable").forEach((element) => {
    element.addEventListener("pointerenter", () => setHover(true));
    element.addEventListener("pointerleave", () => setHover(false));
  });

  animateRing();
}

function initAnalytics() {
  const { googleAnalyticsId, microsoftClarityId } = analyticsConfig;

  if (googleAnalyticsId) {
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", googleAnalyticsId);
  }

  if (microsoftClarityId) {
    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    const clarityScript = document.createElement("script");
    clarityScript.async = true;
    clarityScript.src = `https://www.clarity.ms/tag/${microsoftClarityId}`;
    document.head.appendChild(clarityScript);
  }
}

initLoader();
initWorld();
initDepthScroll();
initChat();
initCustomCursor();
initAnalytics();
