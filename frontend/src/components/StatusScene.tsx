import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function StatusScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const materials = [
      new THREE.MeshStandardMaterial({ color: '#6366f1', emissive: '#4338ca', emissiveIntensity: 0.45, metalness: 0.65, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ color: '#22d3ee', emissive: '#0891b2', emissiveIntensity: 0.5, metalness: 0.7, roughness: 0.18 }),
      new THREE.MeshStandardMaterial({ color: '#a855f7', emissive: '#7e22ce', emissiveIntensity: 0.45, metalness: 0.6, roughness: 0.25 }),
    ];

    const geometries = [
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      new THREE.IcosahedronGeometry(0.78, 0),
      new THREE.TorusKnotGeometry(0.42, 0.14, 128, 16),
    ];

    geometries.forEach((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, materials[index]);
      mesh.position.x = (index - 1) * 1.7;
      mesh.position.y = index === 1 ? 0.35 : -0.25;
      group.add(mesh);
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.35 });
    const points = [
      new THREE.Vector3(-1.7, -0.25, 0),
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(1.7, -0.25, 0),
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial));

    scene.add(new THREE.AmbientLight('#c7d2fe', 0.9));
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight('#22d3ee', 22, 14);
    cyanLight.position.set(-3, 1.5, 3);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight('#a855f7', 20, 14);
    violetLight.position.set(3, -1.5, 2);
    scene.add(violetLight);

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += 0.006;
      group.rotation.x = Math.sin(Date.now() * 0.0008) * 0.12;
      group.children.forEach((child, index) => {
        child.rotation.x += 0.006 + index * 0.002;
        child.rotation.y += 0.008 + index * 0.002;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <div className="status-scene" ref={mountRef} aria-label="Animated service topology" />;
}
