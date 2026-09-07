import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const FLOWER_INFO = {
  'Dusty Rose Bloom': {
    desc: 'The signature everlasting rose — preserved and hand-wrapped.',
    product: '/shop?category=bouquets'
  },
  'Sage Eucalyptus': {
    desc: 'Fragrant sage eucalyptus foliage for soft, airy texture.',
    product: '/shop?category=bouquets'
  },
  'Terracotta Marigold': {
    desc: 'Warm, sunlit tones inspired by festival garlands.',
    product: '/shop?category=bouquets'
  },
  'Blush Peony': {
    desc: 'A full, romantic peony bloom — the favourite for wedding gifts.',
    product: '/shop?category=bouquets'
  }
};

export default function BotanicalCanvas() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [webglOk, setWebglOk] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let renderer;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 550;
    const hoveredRef = { current: null };

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (err) {
      setWebglOk(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    container.appendChild(renderer.domElement);

    // Soft studio lighting for a handcrafted feel
    const ambientLight = new THREE.AmbientLight(0xfff7f0, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffe8dc, 2.1);
    dirLight.position.set(12, 18, 14);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xdbe8df, 1.3);
    fillLight.position.set(-15, -10, 10);
    scene.add(fillLight);

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

      // Remember materials so hover can highlight them
      flower.userData.materials = [coreMat, petalMat];
      flower.userData.baseScale = scale;
      return flower;
    }

    function placeFlower(name, colorHex, scale, pos, rot) {
      const flower = createFlower(colorHex, scale);
      flower.position.set(...pos);
      flower.rotation.set(...rot);
      flower.userData.name = name;
      // Give each mesh a reference for raycasting
      flower.traverse((child) => {
        if (child.isMesh) child.userData.flowerName = name;
      });
      floralGroup.add(flower);
      return flower;
    }

    const flower1 = placeFlower('Dusty Rose Bloom', 0xdf9b98, 1.4, [2.0, 0.5, 2], [0.3, -0.4, 0.2]);
    const flower2 = placeFlower('Sage Eucalyptus', 0x8a9a86, 1.1, [4.0, -2.2, 0.5], [-0.2, 0.5, -0.3]);
    const flower3 = placeFlower('Terracotta Marigold', 0xd4a373, 1.2, [0.8, -3.0, 3], [0.4, -0.2, 0.5]);
    const flower4 = placeFlower('Blush Peony', 0xe8b4b8, 0.9, [3.8, 2.2, -1], [0.1, -0.5, 0.4]);

    const flowers = [flower1, flower2, flower3, flower4];

    // Floating petals drifting in a gentle breeze
    const petals = [];
    const petalGeo = new THREE.SphereGeometry(0.35, 12, 12);
    petalGeo.scale(1.8, 0.25, 1.2);

    for (let i = 0; i < 30; i++) {
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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pointer interaction state
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let targetRotX = 0;
    let targetRotY = 0;
    let dragRotX = 0;
    let dragRotY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastDragX = 0;
    let lastDragY = 0;

    const getLocalPoint = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
    };

    const handlePointerMove = (e) => {
      const { x, y } = getLocalPoint(e);
      pointer.x = (x / (container.clientWidth / 2));
      pointer.y = -(y / (container.clientHeight / 2));

      if (!isDragging) {
        targetRotX = y * 0.002;
        targetRotY = x * 0.002;
      }

      // Hover highlight + info
      if (!isDragging && !reduceMotion) {
        raycaster.setFromCamera(pointer, camera);
        const meshes = flowers.flatMap((f) => f.children.filter((c) => c.isMesh));
        const hits = raycaster.intersectObjects(meshes);
        const hitObj = hits.length ? hits[0].object : null;
        const hitName = hitObj && hitObj.userData ? hitObj.userData.flowerName || null : null;
        hoveredRef.current = hitName;
        setHovered(hitName);
        flowers.forEach((f) => {
          const active = f.userData.name === hitName;
          f.userData.materials.forEach((m) => {
            m.emissive.setHex(active ? 0x2a1508 : 0x000000);
            m.emissiveIntensity = active ? 0.25 : 0;
          });
        });
      }
    };

    const handlePointerDown = (e) => {
      const { x, y } = getLocalPoint(e);
      isDragging = true;
      dragStartX = x;
      dragStartY = y;
      lastDragX = x;
      lastDragY = y;
      container.style.cursor = 'grabbing';
    };

    const handlePointerMoveDrag = (e) => {
      if (!isDragging) return;
      const { x, y } = getLocalPoint(e);
      dragRotY += (x - lastDragX) * 0.01;
      dragRotX += (y - lastDragY) * 0.008;
      dragRotX = Math.max(-0.6, Math.min(0.6, dragRotX));
      lastDragX = x;
      lastDragY = y;
    };

    const handlePointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      // Click = small movement threshold
      const { x, y } = getLocalPoint(e);
      const moved = Math.hypot(x - dragStartX, y - dragStartY);
      if (moved < 8) {
        raycaster.setFromCamera(pointer, camera);
        const meshes = flowers.flatMap((f) => f.children.filter((c) => c.isMesh));
        const hits = raycaster.intersectObjects(meshes);
        const hitObj = hits.length ? hits[0].object : null;
        const name = hitObj && hitObj.userData ? hitObj.userData.flowerName : null;
        if (name && FLOWER_INFO[name]) {
          setSelected({ name, ...FLOWER_INFO[name] });
        }
      }
    };

    const handlePointerLeave = () => {
      hoveredRef.current = null;
      setHovered(null);
      flowers.forEach((f) => {
        f.userData.materials.forEach((m) => {
          m.emissive.setHex(0x000000);
          m.emissiveIntensity = 0;
        });
      });
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMoveDrag);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    const clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetRotX += (0 - targetRotX) * 0.02;
      targetRotY += (0 - targetRotY) * 0.02;

      const idleRotY = Math.sin(elapsedTime * 0.3) * 0.08;
      const idleRotX = Math.cos(elapsedTime * 0.25) * 0.06;
      floralGroup.rotation.y = dragRotY + targetRotY + idleRotY;
      floralGroup.rotation.x = dragRotX - targetRotX + idleRotX;

      // Hover focus: gentle scale emphasis
      flowers.forEach((f) => {
        const active = f.userData.name === hoveredRef.current;
        const targetScale = active ? f.userData.baseScale * 1.12 : f.userData.baseScale;
        f.scale.setScalar(f.scale.x + (targetScale - f.scale.x) * 0.08);
      });

      flower1.rotation.y += 0.004;
      flower2.rotation.y -= 0.003;
      flower3.rotation.z += 0.003;
      flower4.rotation.x += 0.004;

      flower1.position.y = 0.5 + Math.sin(elapsedTime * 0.8) * 0.25;
      flower2.position.y = -2.2 + Math.cos(elapsedTime * 0.7) * 0.2;

      petals.forEach((p) => {
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

    if (reduceMotion) {
      // Static graceful fallback: single frame, no animation loop
      renderer.render(scene, camera);
    } else {
      animate();
    }

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
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMoveDrag);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // WebGL unavailable — beautiful static fallback
  if (!webglOk) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center rounded-3xl"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, #fbe9e2 0%, #f6e3d8 35%, #efe3d0 70%, #e7dcc6 100%)'
        }}
      >
        <div className="text-[64px] leading-none mb-3" aria-hidden="true">
          🌸
        </div>
        <p className="font-serif text-[20px] text-[#180f0a]">A hand-tied Flora Alchemy bouquet</p>
        <p className="text-[12px] text-[#80756f] mt-1 max-w-[240px] text-center">
          Your browser could not start the 3D preview — the bouquet still looks lovely on this page.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative">
      {hovered && !selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3.5 py-1.5 rounded-full shadow border border-[#e5e2dd] text-[12px] font-medium text-[#180f0a] pointer-events-none">
          {hovered} — click for details
        </div>
      )}
      {selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-xl border border-[#e5e2dd] p-4 animate-fade-in">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[14px] font-semibold text-[#180f0a]">{selected.name}</p>
              <p className="text-[12px] text-[#4e4540] mt-0.5">{selected.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close flower details"
              className="shrink-0 w-6 h-6 rounded-full text-[#80756f] hover:bg-[#f6f3ee] flex items-center justify-center text-[14px]"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate(selected.product)}
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#964735] hover:underline"
          >
            Shop this look →
          </button>
        </div>
      )}
    </div>
  );
}