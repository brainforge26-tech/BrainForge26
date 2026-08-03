'use client';

import * as React from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Interactive 3D Particles Constellation
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#FF5500'); // Vibrant Orange
    const color2 = new THREE.Color('#F59E0B'); // Amber Glow

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 70;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Canvas texture for smooth round particles
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(255, 85, 0, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(particlesMesh);

    // 3. Floating Background Geometric Wireframes
    const icoGeometry = new THREE.IcosahedronGeometry(14, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FF5500'),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    icoMesh.position.set(-25, 10, -10);
    scene.add(icoMesh);

    const torusGeom = new THREE.TorusKnotGeometry(8, 2, 64, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#F59E0B'),
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMaterial);
    torusMesh.position.set(28, -15, -15);
    scene.add(torusMesh);

    // 4. Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.012;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.012;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0004;

      icoMesh.rotation.y += 0.002;
      icoMesh.rotation.x += 0.001;

      torusMesh.rotation.y -= 0.002;
      torusMesh.rotation.z += 0.001;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      torusGeom.dispose();
      torusMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden"
      aria-hidden="true"
    />
  );
}
