'use client';

import * as React from 'react';
import * as THREE from 'three';

export function Hero3DGlobe() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Interactive 3D Glowing Globe
    const sphereGeometry = new THREE.IcosahedronGeometry(7, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FF5500'),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    scene.add(sphereMesh);

    // Inner Glowing Core
    const innerGeometry = new THREE.IcosahedronGeometry(4.5, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#F59E0B'),
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // 3. Orbiting Particle Rings
    const ringCount = 120;
    const ringGeometry = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringCount * 3);

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 10.5;
      ringPositions[i * 3] = Math.cos(angle) * radius;
      ringPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.3;
      ringPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));

    const ringMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#FF7700'),
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const ringPoints = new THREE.Points(ringGeometry, ringMaterial);
    ringPoints.rotation.x = Math.PI / 6;
    scene.add(ringPoints);

    // Second Orbit Ring
    const ringPoints2 = new THREE.Points(ringGeometry, ringMaterial);
    ringPoints2.rotation.x = -Math.PI / 4;
    ringPoints2.rotation.y = Math.PI / 3;
    scene.add(ringPoints2);

    // 4. Mouse Tracking for 3D Rotation Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.002;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.002;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      sphereMesh.rotation.y += 0.004;
      sphereMesh.rotation.x += 0.002;

      innerMesh.rotation.y -= 0.006;
      innerMesh.rotation.z += 0.003;

      ringPoints.rotation.z += 0.005;
      ringPoints2.rotation.z -= 0.004;

      scene.rotation.y = targetX;
      scene.rotation.x = targetY;

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
      sphereGeometry.dispose();
      wireframeMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] pointer-events-none z-0 opacity-80"
    />
  );
}
