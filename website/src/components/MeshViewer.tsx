import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { selectedNode, cameraPosition, activeCategory } from '../stores/mesh';

interface RuleNode {
  id: string;
  title: string;
  category: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  position: [number, number, number];
  connections: string[];
}

interface MeshViewerProps {
  rules: RuleNode[];
}

// Category colors
const categoryColors: Record<string, string> = {
  core: '#6366f1',           // indigo
  architecture: '#8b5cf6',   // violet
  security: '#ef4444',       // red
  testing: '#10b981',        // emerald
  prompting: '#06b6d4',      // cyan
  workflows: '#f59e0b',      // amber
  performance: '#ec4899',    // pink
};

// Impact sizes
const impactSizes: Record<string, number> = {
  low: 0.3,
  medium: 0.5,
  high: 0.7,
  critical: 1.0,
};

function RuleNodes({ rules }: { rules: RuleNode[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const $selectedNode = useStore(selectedNode);
  const $activeCategory = useStore(activeCategory);
  const { camera, raycaster, pointer } = useThree();
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter rules by active category
  const filteredRules = $activeCategory === 'all' 
    ? rules 
    : rules.filter(r => r.category === $activeCategory);

  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();

    filteredRules.forEach((rule, i) => {
      // Position
      dummy.position.set(...rule.position);
      
      // Scale based on impact
      const scale = impactSizes[rule.impact];
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Color based on category
      const color = categoryColors[rule.category] || '#6366f1';
      tempColor.set(color);
      
      // Highlight if selected or hovered
      if ($selectedNode === rule.id || hoveredIndex === i) {
        tempColor.multiplyScalar(1.5);
      }
      
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [filteredRules, $selectedNode, hoveredIndex]);

  // Create connection lines
  useEffect(() => {
    if (!linesRef.current) return;

    const positions: number[] = [];
    const colors: number[] = [];
    const tempColor = new THREE.Color();

    filteredRules.forEach(rule => {
      const ruleIndex = filteredRules.findIndex(r => r.id === rule.id);
      if (ruleIndex === -1) return;

      rule.connections.forEach(connId => {
        const connectedRule = filteredRules.find(r => r.id === connId);
        if (!connectedRule) return;

        // Line start and end positions
        positions.push(...rule.position);
        positions.push(...connectedRule.position);

        // Line color (blend of both node colors)
        const color1 = categoryColors[rule.category] || '#6366f1';
        const color2 = categoryColors[connectedRule.category] || '#6366f1';
        tempColor.set(color1);
        colors.push(tempColor.r, tempColor.g, tempColor.b);
        tempColor.set(color2);
        colors.push(tempColor.r, tempColor.g, tempColor.b);
      });
    });

    const geometry = linesRef.current.geometry;
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
  }, [filteredRules]);

  // Mouse interaction
  const handlePointerMove = (event: PointerEvent) => {
    if (!meshRef.current) return;

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      setHoveredIndex(instanceId ?? null);
      document.body.style.cursor = 'pointer';
    } else {
      setHoveredIndex(null);
      document.body.style.cursor = 'default';
    }
  };

  const handleClick = () => {
    if (hoveredIndex !== null) {
      const rule = filteredRules[hoveredIndex];
      selectedNode.set(rule.id);
    }
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [hoveredIndex, filteredRules]);

  // Animate nodes (gentle floating)
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();

    filteredRules.forEach((rule, i) => {
      // Gentle floating animation
      const offset = Math.sin(time + i * 0.5) * 0.1;
      dummy.position.set(
        rule.position[0],
        rule.position[1] + offset,
        rule.position[2]
      );
      
      const scale = impactSizes[rule.impact];
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>

      {/* Rule nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, filteredRules.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          roughness={0.4}
          metalness={0.6}
          emissive="#6366f1"
          emissiveIntensity={0.2}
        />
      </instancedMesh>
    </group>
  );
}

function Scene({ rules }: { rules: RuleNode[] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
      
      {/* Grid helper */}
      <gridHelper args={[50, 50, '#6366f1', '#1e293b']} position={[0, -10, 0]} />
      
      {/* Rule nodes */}
      <RuleNodes rules={rules} />
    </>
  );
}

export default function MeshViewer({ rules }: MeshViewerProps) {
  return (
    <div className="w-full h-full min-h-[600px] relative">
      <Canvas>
        <Scene rules={rules} />
      </Canvas>
      
      {/* Category Legend */}
      <div className="absolute top-4 left-4 glass p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <button
              key={category}
              onClick={() => {
                if (activeCategory.get() === category) {
                  activeCategory.set('all');
                } else {
                  activeCategory.set(category);
                }
              }}
              className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity w-full"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 right-4 glass p-4 rounded-lg text-sm space-y-1">
        <p><strong>Left click + drag:</strong> Rotate</p>
        <p><strong>Right click + drag:</strong> Pan</p>
        <p><strong>Scroll:</strong> Zoom</p>
        <p><strong>Click node:</strong> View details</p>
      </div>
    </div>
  );
}
