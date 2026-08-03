'use client';

import * as React from 'react';
import * as THREE from 'three';

export function FloatingShapes3D() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Add Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#FF5500', 3, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 3. Floating 3D Geometric Objects
    const material1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FF5500'),
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });

    const material2 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F59E0B'),
      wireframe: true,
      roughness: 0.3,
      metalness: 0.7,
    });

    // Object 1: Torus Knot
    const knotGeom = new THREE.TorusKnotGeometry(2.5, 0.6, 64, 16);
    const knotMesh = new THREE.Mesh(knotGeom, material1);
    knotMesh.position.set(-6, 1, 0);
    scene.add(knotMesh);

    // Object 2: Octahedron
    const octGeom = new THREE.OctahedronGeometry(3.2, 0);
    const octMesh = new THREE.Mesh(octGeom, material2);
    octMesh.position.set(6, -1, 0);
    scene.add(octMesh);

    // 4. Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
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

      knotMesh.rotation.x += 0.008;
      knotMesh.rotation.y += 0.01;

      octMesh.rotation.x -= 0.006;
      octMesh.rotation.y -= 0.009;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
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
      knotGeom.dispose();
      material1.dispose();
      octGeom.dispose();
      material2.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-48 sm:h-64 relative pointer-events-none z-0 opacity-70 my-4"
    />
  );
}
