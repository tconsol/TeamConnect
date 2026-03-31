import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TECH_STACK = [
  { label: 'React', color: '#61DAFB', category: 'frontend' },
  { label: 'TypeScript', color: '#3178C6', category: 'frontend' },
  { label: 'Next.js', color: '#ffffff', category: 'frontend' },
  { label: 'Vue.js', color: '#4FC08D', category: 'frontend' },
  { label: 'Tailwind', color: '#38BDF8', category: 'frontend' },
  { label: 'Node.js', color: '#6ABB3E', category: 'backend' },
  { label: 'Python', color: '#FFD43B', category: 'backend' },
  { label: 'Java', color: '#F89820', category: 'backend' },
  { label: 'Spring Boot', color: '#6DB33F', category: 'backend' },
  { label: 'Express', color: '#888888', category: 'backend' },
  { label: 'MongoDB', color: '#4DB33D', category: 'database' },
  { label: 'PostgreSQL', color: '#336791', category: 'database' },
  { label: 'MySQL', color: '#4479A1', category: 'database' },
  { label: 'Redis', color: '#DC382D', category: 'database' },
  { label: 'Docker', color: '#2496ED', category: 'tools' },
  { label: 'AWS', color: '#FF9900', category: 'tools' },
  { label: 'Kubernetes', color: '#326CE5', category: 'tools' },
  { label: 'GraphQL', color: '#E10098', category: 'backend' },
  { label: 'Kafka', color: '#231F20', category: 'tools' },
  { label: 'Framer', color: '#BB4B96', category: 'frontend' },
];

function fibonacciSphere(n: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return points;
}

interface TechGlobeProps {
  radius?: number;
  width?: number;
  height?: number;
}

export default function TechGlobe({ radius = 180, width = 560, height = 560 }: TechGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    globe: THREE.Group;
    labels: { mesh: THREE.Mesh; originalPos: THREE.Vector3; index: number }[];
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    rotationVelocity: { x: number; y: number };
    hoveredIndex: number | null;
    animFrame: number;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.z = radius * 3.2;

    // Globe group
    const globe = new THREE.Group();
    scene.add(globe);

    // ─── Wireframe sphere ───
    const wireGeo = new THREE.SphereGeometry(radius, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    globe.add(new THREE.Mesh(wireGeo, wireMat));

    // ─── Equator / latitude rings ───
    for (const lat of [-60, -30, 0, 30, 60]) {
      const r = radius * Math.cos((lat * Math.PI) / 180);
      const y = radius * Math.sin((lat * Math.PI) / 180);
      const ring = new THREE.RingGeometry(r - 0.4, r + 0.4, 64);
      const rMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ring, rMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = y;
      globe.add(ringMesh);
    }

    // ─── Tech labels as canvas sprites ───
    const positions = fibonacciSphere(TECH_STACK.length);
    const labelMeshes: { mesh: THREE.Mesh; originalPos: THREE.Vector3; index: number }[] = [];

    TECH_STACK.forEach((tech, i) => {
      const [x, y, z] = positions[i];
      const pos = new THREE.Vector3(x * radius, y * radius, z * radius);

      // Canvas label
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      // Background pill
      ctx.fillStyle = 'rgba(10,8,30,0.85)';
      const rr = 12;
      ctx.beginPath();
      ctx.moveTo(rr, 0);
      ctx.lineTo(canvas.width - rr, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, rr);
      ctx.lineTo(canvas.width, canvas.height - rr);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - rr, canvas.height);
      ctx.lineTo(rr, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - rr);
      ctx.lineTo(0, rr);
      ctx.quadraticCurveTo(0, 0, rr, 0);
      ctx.closePath();
      ctx.fill();

      // Border
      ctx.strokeStyle = tech.color + '55';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dot
      ctx.beginPath();
      ctx.arc(20, 32, 6, 0, Math.PI * 2);
      ctx.fillStyle = tech.color;
      ctx.fill();

      // Text
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 22px Inter, system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(tech.label, 34, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const w = 1.8;
      const h = 0.45;
      const geo = new THREE.PlaneGeometry(w * 30, h * 30);
      const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthTest: false });
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.copy(pos);
      mesh.lookAt(camera.position);
      globe.add(mesh);

      labelMeshes.push({ mesh, originalPos: pos.clone(), index: i });
    });

    // ─── Interaction state ───
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotVelocity = { x: 0, y: 0.003 };
    let hoveredIndex: number | null = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      rotVelocity = { x: 0, y: 0 };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotVelocity = { x: dy * 0.003, y: dx * 0.003 };
        globe.rotation.y += dx * 0.003;
        globe.rotation.x += dy * 0.003;
        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        // Hover detection
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const meshes = labelMeshes.map((l) => l.mesh);
        const hits = raycaster.intersectObjects(meshes);
        hoveredIndex = hits.length > 0 ? labelMeshes.findIndex((l) => l.mesh === hits[0].object) : null;
        renderer.domElement.style.cursor = hoveredIndex !== null ? 'pointer' : 'grab';
      }
    };
    const onMouseUp = () => { isDragging = false; };
    const onTouchStart = (e: TouchEvent) => { isDragging = true; prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; rotVelocity = { x: 0, y: 0 }; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      rotVelocity = { x: dy * 0.003, y: dx * 0.003 };
      globe.rotation.y += dx * 0.003;
      globe.rotation.x += dy * 0.003;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Animation loop
    let animFrame: number = 0;
    const animate = () => {
      animFrame = requestAnimationFrame(animate);

      if (!isDragging) {
        globe.rotation.y += rotVelocity.y;
        globe.rotation.x += rotVelocity.x;
        rotVelocity.x *= 0.96;
      }

      // Make labels face camera
      labelMeshes.forEach(({ mesh }, i) => {
        const worldPos = mesh.getWorldPosition(new THREE.Vector3());
        const isHovered = hoveredIndex === i;

        // Scale by z depth
        const depth = worldPos.z;
        const maxDepth = radius;
        const depthRatio = (depth + maxDepth) / (2 * maxDepth);
        const baseScale = 0.6 + depthRatio * 0.6;
        const scale = isHovered ? baseScale * 1.15 : baseScale;
        mesh.scale.setScalar(scale);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.3 + depthRatio * 0.7;

        // Face camera
        mesh.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { renderer, scene, camera, globe, labels: labelMeshes, isDragging, prevMouse, rotationVelocity: rotVelocity, hoveredIndex, animFrame };

    return () => {
      cancelAnimationFrame(animFrame);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      while (mount.firstChild) mount.removeChild(mount.firstChild);
      renderer.dispose();
    };
  }, [radius, width, height]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { label: 'Frontend', color: '#61DAFB' },
          { label: 'Backend', color: '#6ABB3E' },
          { label: 'Database', color: '#4DB33D' },
          { label: 'DevOps / Tools', color: '#2496ED' },
        ].map((cat) => (
          <div key={cat.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
            <span className="text-xs text-text-muted">{cat.label}</span>
          </div>
        ))}
      </div>

      <div
        ref={mountRef}
        style={{ width, height, cursor: 'grab' }}
        className="select-none"
      />

      <p className="text-xs text-text-muted mt-4 tracking-wider uppercase">Drag to rotate · Hover to highlight</p>
    </div>
  );
}
