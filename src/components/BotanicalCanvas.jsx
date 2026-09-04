import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BotanicalCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Ambient & Soft Studio Directional Lights
    const ambientLight = new THREE.AmbientLight(0xfff7f0, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffe8dc, 2.0);
    dirLight.position.set(12, 18, 14);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xdbe8df, 1.2);
    fillLight.position.set(-15, -10, 10);
    scene.add(fillLight);

    // Group to hold all floral elements
    const floralGroup = new THREE.Group();
    scene.add(floralGroup);

    const petalColors = [0xdf9b98, 0xe8b4b8, 0x8a9a86, 0xd4a373, 0xf3d2c1, 0xc5a880];

    function createFlower(colorHex, scale = 1) {
      const flower = new THREE.Group();
      
      const coreGeo = new THREE.SphereGeometry(0.55 * scale, 24, 24);
      const coreMat = new THREE.MeshLambertMaterial({ color: 0xecd599, roughness: 0.8 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      flower.add(core);

      const petalCount = 8;
      const petalMat = new THREE.MeshLambertMaterial({ color: colorHex, roughness: 0.6 });
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petalGeo = new THREE.CylinderGeometry(0.18 * scale, 0.55 * scale, 1.6 * scale, 16);
        petalGeo.scale(1, 1, 0.35);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        
        petal.position.x = Math.cos(angle) * 0.9 * scale;
        petal.position.y = Math.sin(angle) * 0.9 * scale;
        petal.rotation.z = angle - Math.PI / 2;
        petal.rotation.x = 0.25;
        flower.add(petal);
      }
      return flower;
    }

    const flower1 = createFlower(0xdf9b98, 1.4);
    flower1.position.set(2.0, 0.5, 2);
    flower1.rotation.set(0.3, -0.4, 0.2);
    floralGroup.add(flower1);

    const flower2 = createFlower(0x8a9a86, 1.1);
    flower2.position.set(4.0, -2.2, 0.5);
    flower2.rotation.set(-0.2, 0.5, -0.3);
    floralGroup.add(flower2);

    const flower3 = createFlower(0xd4a373, 1.2);
    flower3.position.set(0.8, -3.0, 3);
    flower3.rotation.set(0.4, -0.2, 0.5);
    floralGroup.add(flower3);

    const flower4 = createFlower(0xe8b4b8, 0.9);
    flower4.position.set(3.8, 2.2, -1);
    flower4.rotation.set(0.1, -0.5, 0.4);
    floralGroup.add(flower4);

    // Floating petals drifting in breeze
    const petals = [];
    const petalGeo = new THREE.SphereGeometry(0.35, 12, 12);
    petalGeo.scale(1.8, 0.25, 1.2);

    for (let i = 0; i < 35; i++) {
      const pMat = new THREE.MeshLambertMaterial({
        color: petalColors[i % petalColors.length],
        roughness: 0.7
      });
      const p = new THREE.Mesh(petalGeo, pMat);
      p.position.set(
        (Math.random() - 0.2) * 18,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12
      );
      p.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      p.userData = {
        speedX: (Math.random() - 0.5) * 0.008,
        speedY: -0.006 - Math.random() * 0.008,
        rotSpeedX: 0.01 + Math.random() * 0.015,
        rotSpeedY: 0.008 + Math.random() * 0.012
      };
      floralGroup.add(p);
      petals.push(p);
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x * 0.002;
      mouseY = y * 0.002;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      floralGroup.rotation.y = targetX * 0.8 + Math.sin(elapsedTime * 0.3) * 0.08;
      floralGroup.rotation.x = -targetY * 0.8 + Math.cos(elapsedTime * 0.25) * 0.06;

      flower1.rotation.y += 0.004;
      flower2.rotation.y -= 0.003;
      flower3.rotation.z += 0.003;
      flower4.rotation.x += 0.004;

      flower1.position.y = 0.5 + Math.sin(elapsedTime * 0.8) * 0.25;
      flower2.position.y = -2.2 + Math.cos(elapsedTime * 0.7) * 0.2;

      petals.forEach(p => {
        p.position.y += p.userData.speedY;
        p.position.x += Math.sin(elapsedTime + p.position.z) * 0.006;
        p.rotation.x += p.userData.rotSpeedX;
        p.rotation.y += p.userData.rotSpeedY;

        if (p.position.y < -8) {
          p.position.y = 8;
          p.position.x = (Math.random() - 0.2) * 18;
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW && newH) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}
