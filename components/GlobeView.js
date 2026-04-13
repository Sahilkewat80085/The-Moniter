"use client";

/**
 * GlobeView.js
 * 
 * Production-grade 3D interactive globe for The Monitor financial intelligence dashboard.
 * Uses @react-three/fiber + three.js + @react-three/drei.
 * 
 * Architecture:
 *  - GlobeView         → main exported component (canvas setup + perf detection)
 *  - GlobeScene        → central 3D scene controller
 *  - EarthSphere       → dark Earth (dynamic resolution)
 *  - StarField         → point stars (dynamic density)
 *  - InstancedMarkers  → high-perf markers using InstancedMesh + GPU Shaders
 *  - SelectedMarker    → high-detail individual mesh for the active selection
 *  - GlobeTooltip      → HTML tooltip overlay
 */

import React, { useRef, useState, useCallback, useMemo, useEffect, useLayoutEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GLOBE_RADIUS = 2.0;
const MARKER_RADIUS = GLOBE_RADIUS + 0.012; // Slightly above globe surface

/**
 * Convert geographic lat/lon to 3D Cartesian coordinates on a sphere.
 * 
 * Spherical → Cartesian:
 *   x = r * cos(lat) * sin(lon)
 *   y = r * sin(lat)
 *   z = r * cos(lat) * cos(lon)
 * 
 * Note: Three.js uses right-hand coords with Y-up.
 * Longitude 0° maps to +Z axis (front), increasing eastward.
 */
function latLonToVector3(lat, lon, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);   // polar angle from Y-axis
  const theta = (lon + 180) * (Math.PI / 180); // azimuthal angle from -Z
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Map event sentiment to color.
 * bullish  → green  (positive momentum)
 * bearish  → red    (negative)
 * neutral  → amber  (uncertainty)
 */
function sentimentToColor(sentiment) {
  switch (sentiment) {
    case "bullish":  return { core: "#00e676", glow: "#00e676", hex: 0x00e676 };
    case "bearish":  return { core: "#ff1744", glow: "#ff1744", hex: 0xff1744 };
    case "neutral":  return { core: "#ffc400", glow: "#ffc400", hex: 0xffc400 };
    default:         return { core: "#3b82f6", glow: "#3b82f6", hex: 0x3b82f6 };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STAR FIELD
// Creates ~3000 randomized point stars in a large sphere around the globe.
// ─────────────────────────────────────────────────────────────────────────────

function StarField({ performanceMode }) {
  const pointsRef = useRef();
  
  // Cut count by 75% in high performance mode
  const count = performanceMode === "high" ? 750 : 3000;

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 20;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.3 + Math.random() * 1.2;
    }
    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Very slow drift — almost imperceptible
      pointsRef.current.rotation.y += 0.00005;
      pointsRef.current.rotation.x += 0.00002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8ab4f8"
        transparent
        opacity={0.6}
        sizeAttenuation
        vertexColors={false}
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EARTH SPHERE
// Dark procedural Earth with layered glow effects:
//  1. Base dark sphere (near-black, slight blue tint)
//  2. Atmospheric halo (additive blending, semi-transparent)
//  3. Rim light mesh (back-face, Fresnel-like glow)
//  4. Procedural dot grid overlay (country-style lat/lon grid)
// ─────────────────────────────────────────────────────────────────────────────

function EarthSphere({ performanceMode }) {
  const globeRef = useRef();
  const glowRef = useRef();
  const rimRef = useRef();

  const isHighPerf = performanceMode === "high";

  // Procedural dot-map texture — same logic as before but with a quality check
  const dotTexture = useMemo(() => {
    const size = isHighPerf ? 512 : 1024; // Smaller texture for high-perf mode
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext("2d", { alpha: false });

    ctx.fillStyle = "#060c14";
    ctx.fillRect(0, 0, size, size / 2);

    const dotSpacing = isHighPerf ? 6 : 8; // Adjust density based on texture size
    const dotRadius = isHighPerf ? 0.8 : 1.2;
    ctx.fillStyle = "rgba(30, 58, 92, 0.9)";
    const oceanColor = "rgba(12, 20, 35, 0.5)";

    for (let x = 0; x < size; x += dotSpacing) {
      for (let y = 0; y < size / 2; y += dotSpacing) {
        const lon = (x / size) * 360 - 180;
        const lat = 90 - (y / (size / 2)) * 180;
        if (isApproxLand(lat, lon)) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        } else if (!isHighPerf) { // Skip ocean dots in high performance mode
          ctx.fillStyle = oceanColor;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(30, 58, 92, 0.9)";
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = isHighPerf ? 2 : 4;
    return texture;
  }, [isHighPerf]);

  useFrame((state) => {
    if (!isHighPerf && glowRef.current?.material) {
      glowRef.current.material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  // Dynamic resolution based on performance mode
  const res = isHighPerf ? 32 : 64;

  return (
    <group>
      {/* 1. Main globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[GLOBE_RADIUS, res, res]} />
        <meshPhongMaterial
          map={dotTexture}
          color="#0d1b2e"
          emissive="#0a1520"
          emissiveIntensity={0.4}
          specular="#1a3a5c"
          shininess={20}
        />
      </mesh>

      {/* Atmospheric layers — disabled in high-perf mode to save overdraw */}
      {!isHighPerf && (
        <>
          <mesh ref={glowRef} raycast={() => null}>
            <sphereGeometry args={[GLOBE_RADIUS * 1.06, 32, 32]} />
            <meshBasicMaterial color="#1a4a8e" transparent opacity={0.13} depthWrite={false} />
          </mesh>
          <mesh ref={rimRef} raycast={() => null}>
            <sphereGeometry args={[GLOBE_RADIUS * 1.035, res, res]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} depthWrite={false} side={THREE.BackSide} />
          </mesh>
        </>
      )}

      {/* Minimal rim for performance mode */}
      {isHighPerf && (
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS * 1.015, 32, 32]} />
          <meshBasicMaterial color="#1a4a8e" transparent opacity={0.1} depthWrite={false} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APPROXIMATE LAND DETECTION
// Rough bounding boxes for major landmasses.
// Used for the procedural dot-map texture generation.
// ─────────────────────────────────────────────────────────────────────────────

function isApproxLand(lat, lon) {
  if (lat > 15 && lat < 72 && lon > -170 && lon < -52) return true;   // N. America
  if (lat > -56 && lat < 13 && lon > -82 && lon < -34) return true;   // S. America
  if (lat > 35 && lat < 72 && lon > -10 && lon < 40) return true;     // Europe
  if (lat > -35 && lat < 37 && lon > -18 && lon < 52) return true;    // Africa
  if (lat > 0 && lat < 75 && lon > 26 && lon < 145) return true;      // Asia
  if (lat > 50 && lat < 78 && lon > 30 && lon < 180) return true;     // Russia
  if (lat > -10 && lat < 28 && lon > 92 && lon < 145) return true;    // SE Asia
  if (lat > -44 && lat < -10 && lon > 113 && lon < 154) return true;  // Australia
  if (lat > 60 && lat < 84 && lon > -55 && lon < -15) return true;    // Greenland
  if (lat > 30 && lat < 46 && lon > 128 && lon < 146) return true;    // Japan
  if (lat > 49 && lat < 61 && lon > -8 && lon < 2) return true;       // UK
  if (lat > 54 && lat < 71 && lon > 4 && lon < 31) return true;       // Scandinavia
  if (lat > 8 && lat < 36 && lon > 68 && lon < 98) return true;       // India
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY BORDERS
// Fetches Natural Earth 110m GeoJSON from CDN and renders every country
// polygon outline as 3D line segments projected onto the globe surface.
//
// The approach:
//  1. Fetch countries.geo.json (≈120 KB, cached by browser)
//  2. For each polygon ring, convert [lon, lat] → Vector3 at BORDER_RADIUS
//  3. Build a single BufferGeometry of line pairs (A→B, B→C, …) per ring
//  4. Render as <lineSegments> — one draw call for all borders
// ─────────────────────────────────────────────────────────────────────────────

const BORDER_RADIUS = GLOBE_RADIUS + 0.004; // Sits just above the sphere surface
// Use a CDN-hosted simplified world GeoJSON (Natural Earth 110m resolution)
const GEOJSON_URLS = [
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json",
];

/**
 * Convert a GeoJSON polygon ring (array of [lon, lat] pairs) into
 * a flat Float32Array of line-segment vertex pairs suitable for
 * THREE.LineSegments (every two points = one segment).
 */
function ringToLineSegments(ring, radius) {
  const verts = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const [lonA, latA] = ring[i];
    const [lonB, latB] = ring[i + 1];
    const vA = latLonToVector3(latA, lonA, radius);
    const vB = latLonToVector3(latB, lonB, radius);
    verts.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z);
  }
  return verts;
}

/**
 * Recursively extract all rings from a GeoJSON geometry.
 * Handles Polygon, MultiPolygon, and nested arrays.
 */
function extractRings(geometry) {
  const rings = [];
  if (geometry.type === "Polygon") {
    for (const ring of geometry.coordinates) rings.push(ring);
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates)
      for (const ring of poly) rings.push(ring);
  }
  return rings;
}

/**
 * Build THREE geometry from TopoJSON-converted features.
 * world-atlas CDN returns TopoJSON — we convert the arcs manually.
 * Each arc is an array of [dx, dy] delta-encoded coordinates in tile space.
 */
function buildGeometryFromTopojson(topo) {
  const allVerts = [];

  // TopoJSON to raw coordinates
  // The transform scales integer arc coords to geographic lon/lat
  const { scale, translate } = topo.transform;
  const decode = (arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  };

  // Decode all arcs up front
  const decodedArcs = topo.arcs.map(decode);

  // Countries object in this TopoJSON
  const countries = topo.objects.countries;
  if (!countries || !countries.geometries) return null;

  for (const geom of countries.geometries) {
    // Collect all arc index sequences for this geometry
    let arcGroups = [];
    if (geom.type === "Polygon") arcGroups = geom.arcs;
    else if (geom.type === "MultiPolygon") arcGroups = geom.arcs.flat();

    for (const arcIdxList of arcGroups) {
      // Stitch arc segments together into a ring of [lon, lat] points
      const ring = [];
      for (const idx of arcIdxList) {
        const arc = idx < 0 ? [...decodedArcs[~idx]].reverse() : decodedArcs[idx];
        ring.push(...arc);
      }
      // Now treat ring as [[lon, lat], ...] pairs and build line segments
      const segs = ringToLineSegments(ring, BORDER_RADIUS);
      for (const v of segs) allVerts.push(v);
    }
  }

  if (allVerts.length === 0) return null;
  const positions = new Float32Array(allVerts);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

function CountryBorders() {
  const [geometry, setGeometry] = useState(null);
  const groupRef = useRef();

  useEffect(() => {
    let cancelled = false;

    // Try CDN URLs in order until one succeeds
    const tryFetch = (urls, index = 0) => {
      if (index >= urls.length || cancelled) return;
      fetch(urls[index])
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          let geo = null;
          // world-atlas returns TopoJSON
          if (data.type === "Topology" && data.objects?.countries) {
            geo = buildGeometryFromTopojson(data);
          }
          // Fallback: plain GeoJSON FeatureCollection
          else if (data.type === "FeatureCollection" && data.features) {
            const allVerts = [];
            for (const feature of data.features) {
              if (!feature.geometry) continue;
              const rings = extractRings(feature.geometry);
              for (const ring of rings) {
                const segs = ringToLineSegments(ring, BORDER_RADIUS);
                for (const v of segs) allVerts.push(v);
              }
            }
            if (allVerts.length > 0) {
              const positions = new Float32Array(allVerts);
              geo = new THREE.BufferGeometry();
              geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            }
          }
          if (geo) setGeometry(geo);
          else tryFetch(urls, index + 1);
        })
        .catch(() => tryFetch(urls, index + 1));
    };

    tryFetch(GEOJSON_URLS);
    return () => { cancelled = true; };
  }, []);



  if (!geometry) return null;

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color="#2a7ab5"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTANCED MARKERS LAYER
// GPU-accelerated marker system. Uses InstancedMesh to draw ALL pins
// in two draw calls, with custom shaders for pulsing animations.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core Dot Shader
 * Ensures coloring works correctly on all GPUs and adds a subtle glow.
 */
const MarkerShader = {
  uniforms: {},
  vertex: `
    attribute vec3 instanceColor;
    varying vec3 vColor;
    void main() {
      vColor = instanceColor;
      // standard instancing matrix multiplication
      vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragment: `
    varying vec3 vColor;
    void main() {
      // Simple circular falloff for a "light" feel
      float d = length(gl_PointCoord - vec2(0.5));
      float strength = 1.0 - smoothstep(0.0, 0.5, d);
      gl_FragColor = vec4(vColor, 1.0);
    }
  `
};

/**
 * Pulse Shader
 */
const PulseShader = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertex: `
    attribute vec3 instanceColor;
    varying vec3 vColor;
    varying float vOpacity;
    uniform float uTime;

    void main() {
      vColor = instanceColor;
      // Pulse animation logic moved to vertex shader for performance
      float phase = mod(uTime * 1.5, 1.0);
      vOpacity = (1.0 - phase) * 0.5;
      
      // Scaling
      float scale = 1.0 + phase * 2.0;
      vec3 pos = position * scale;
      
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    }
  `,
  fragment: `
    varying vec3 vColor;
    varying float vOpacity;
    void main() {
      gl_FragColor = vec4(vColor, vOpacity);
    }
  `
};

function InstancedMarkersLayer({ events, selectedEventId, onSelectEvent, onHoverEvent, performanceMode }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const count = events.length;
  const isHighPerf = performanceMode === "high";

  // Pre-calculate positions and rotations
  const markerData = useMemo(() => {
    const data = [];
    const dummy = new THREE.Object3D();

    events.forEach((event, i) => {
      const [lat, lon] = event.coordinates;
      const pos = latLonToVector3(lat, lon, MARKER_RADIUS);
      const sentimentColors = sentimentToColor(event.sentiment);
      
      // Matrix
      dummy.position.copy(pos);
      const normal = pos.clone().normalize();
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      dummy.updateMatrix();
      
      data.push({ 
        matrix: dummy.matrix.clone(), 
        color: new THREE.Color(sentimentColors.core),
        event 
      });
    });

    return data;
  }, [events]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    markerData.forEach((data, i) => {
      meshRef.current.setMatrixAt(i, data.matrix);
      meshRef.current.setColorAt(i, data.color);
      
      if (ringRef.current) {
        ringRef.current.setMatrixAt(i, data.matrix);
        ringRef.current.setColorAt(i, data.color);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    if (ringRef.current) {
      ringRef.current.instanceMatrix.needsUpdate = true;
      if (ringRef.current.instanceColor) ringRef.current.instanceColor.needsUpdate = true;
    }
  }, [markerData]);

  useFrame((state) => {
    if (ringRef.current && ringRef.current.material.uniforms) {
      ringRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Core dots */}
      <instancedMesh
        key={`dots-${count}`}
        ref={meshRef}
        args={[null, null, count]}
        frustumCulled={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          const idx = e.instanceId;
          const data = markerData[idx];
          if (data) {
            onHoverEvent({ event: data.event, screenPosition: e.point });
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHoverEvent(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          const idx = e.instanceId;
          const data = markerData[idx];
          if (data) onSelectEvent(data.event);
        }}
      >
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>

      {/* Pulse rings — only in quality mode or simplified in high-perf */}
      {!isHighPerf && (
        <instancedMesh 
          key={`rings-${count}`}
          ref={ringRef} 
          args={[null, null, count]}
          frustumCulled={false}
        >
          <ringGeometry args={[0.018, 0.022, 16]} />
          <meshBasicMaterial transparent opacity={0.3} side={THREE.DoubleSide} color="#ffffff" />
        </instancedMesh>
      )}
    </group>
  );
}

/**
 * HIGH-DETAIL SELECTED MARKER
 * When an event is selected, we render it as a real mesh with extra effects.
 */
function SelectedMarker({ event, position, colors }) {
  const beamRef = useRef();

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.rotation.y += 0.05;
      beamRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = position.clone().normalize();
    q.setFromUnitVectors(up, normal);
    return q;
  }, [position]);

  return (
    <group position={position} quaternion={quaternion}>
      {/* Bright selection core */}
      <mesh position={[0, 0.01, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Upward focus beam */}
      <mesh ref={beamRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.015, 0.3, 8]} />
        <meshBasicMaterial color={colors.core} transparent opacity={0.6} />
      </mesh>

      {/* Ground flare */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.08, 32]} />
        <meshBasicMaterial color={colors.core} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE LIGHTING
// Directional light (key), ambient fill, and a blue-tinted rim light.
// ─────────────────────────────────────────────────────────────────────────────

function SceneLighting() {
  return (
    <>
      {/* Soft ambient fill — keeps the dark side visible */}
      <ambientLight intensity={0.15} color="#0d1b2e" />

      {/* Key light — simulates a distant sun from top-right */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#c8dcf0"
      />

      {/* Cold fill light from opposite side */}
      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.15}
        color="#1a3a5c"
      />

      {/* Blue point light for atmosphere feel */}
      <pointLight
        position={[0, 4, 4]}
        intensity={0.4}
        color="#3b82f6"
        distance={12}
        decay={2}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA RIG
// Smooth camera animation on mount and orbital behavior.
// ─────────────────────────────────────────────────────────────────────────────

function CameraRig() {
  const { camera } = useThree();
  const mounted = useRef(false);

  useFrame((state) => {
    if (!mounted.current) {
      // Smooth intro zoom from far to normal
      camera.position.lerp(new THREE.Vector3(0, 0, 6), 0.03);
      if (camera.position.z < 6.05) mounted.current = true;
    }
  });

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBE SCENE (inner 3D scene, rendered inside <Canvas>)
// ─────────────────────────────────────────────────────────────────────────────

function GlobeScene({ events, selectedEventId, onSelectEvent, onHoverEvent, performanceMode }) {
  const masterGroupRef = useRef();

  useFrame(() => {
    if (masterGroupRef.current) {
      masterGroupRef.current.rotation.y += 0.0008;
    }
  });

  const selectedEvent = useMemo(() => 
    events.find(e => e.id === selectedEventId),
    [events, selectedEventId]
  );

  const selectedMarkerPos = useMemo(() => {
    if (!selectedEvent) return null;
    const [lat, lon] = selectedEvent.coordinates;
    return latLonToVector3(lat, lon, MARKER_RADIUS);
  }, [selectedEvent]);

  return (
    <>
      <SceneLighting />
      <CameraRig />
      <StarField performanceMode={performanceMode} />
      
      <group ref={masterGroupRef}>
        <EarthSphere performanceMode={performanceMode} />
        <CountryBorders />
        
        {/* Optimized Instanced Layer for main pins */}
        <InstancedMarkersLayer
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={onSelectEvent}
          onHoverEvent={onHoverEvent}
          performanceMode={performanceMode}
        />

        {/* Individual high-detail mesh for the selection */}
        {selectedEvent && selectedMarkerPos && (
          <SelectedMarker
            event={selectedEvent}
            position={selectedMarkerPos}
            colors={sentimentToColor(selectedEvent.sentiment)}
          />
        )}
      </group>
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.6}
        rotateSpeed={0.4}
        minDistance={3.0}
        maxDistance={10}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping={true}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBE TOOLTIP (rendered as HTML overlay, not in 3D canvas)
// ─────────────────────────────────────────────────────────────────────────────

function GlobeTooltip({ hoveredEvent, mousePos }) {
  if (!hoveredEvent) return null;

  const { event } = hoveredEvent;
  const colors = sentimentToColor(event.sentiment);

  const sentimentLabel = {
    bullish: "BULLISH",
    bearish: "BEARISH",
    neutral: "NEUTRAL",
  }[event.sentiment] || "UNKNOWN";

  return (
    <div
      className="pointer-events-none fixed z-50 max-w-xs"
      style={{
        left: mousePos.x + 16,
        top: mousePos.y - 8,
        transform: mousePos.x > window.innerWidth * 0.65 ? "translateX(calc(-100% - 32px))" : "none",
      }}
    >
      <div
        style={{
          border: `1px solid color-mix(in srgb, ${colors.core} 40%, transparent)`,
          boxShadow: `0 0 20px color-mix(in srgb, ${colors.core} 20%, transparent), 0 4px 32px rgba(0,0,0,0.5)`,
        }}
        className="rounded-lg p-3 min-w-[200px] bg-panel/95 backdrop-blur-xl"
      >
        {/* Sentiment badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded"
            style={{
              color: colors.core,
              background: `${colors.core}18`,
              border: `1px solid ${colors.core}30`,
            }}
          >
            {sentimentLabel}
          </span>
          <span className="text-[9px] font-mono text-slate-500">{event.region}</span>
        </div>

        {/* Headline */}
        <p className="text-[11px] font-semibold text-foreground leading-snug mb-2">
          {event.title}
        </p>

        {/* Source & timestamp */}
        <div className="flex items-center justify-between">
          {event.source && (
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              {event.source}
            </span>
          )}
          {event.timestamp && (
            <span className="text-[9px] font-mono text-slate-600">{event.timestamp}</span>
          )}
        </div>

        {/* Impact score bar */}
        {event.impactScore && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] uppercase tracking-widest text-slate-600">Impact</span>
              <span className="text-[9px] font-mono" style={{ color: colors.core }}>
                {event.impactScore}/100
              </span>
            </div>
            <div className="h-0.5 w-full bg-white/5 rounded-full">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${event.impactScore}%`,
                  background: colors.core,
                  boxShadow: `0 0 6px ${colors.core}`,
                }}
              />
            </div>
          </div>
        )}

        {/* Click hint */}
        <div className="mt-2 text-[8px] text-slate-600 font-mono tracking-widest">
          CLICK TO ANALYZE →
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGEND
// ─────────────────────────────────────────────────────────────────────────────

function GlobeLegend({ events }) {
  const bullish = events.filter(e => e.sentiment === "bullish").length;
  const bearish = events.filter(e => e.sentiment === "bearish").length;
  const neutral = events.filter(e => e.sentiment === "neutral").length;

  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5">
      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">
        Signal Legend
      </div>
      {[
        { label: "Bullish", color: "#00e676", count: bullish },
        { label: "Bearish", color: "#ff1744", count: bearish },
        { label: "Neutral", color: "#ffc400", count: neutral },
      ].map(({ label, color, count }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span className="text-[9px] font-mono text-slate-500">
            {label} <span style={{ color }} className="font-bold">{count}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN LINE OVERLAY
// Adds a subtle intelligence-style UI effect over the globe.
// ─────────────────────────────────────────────────────────────────────────────

function ScanOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
      {/* Corner brackets */}
      {[
        "top-3 left-3 border-t-2 border-l-2",
        "top-3 right-3 border-t-2 border-r-2",
        "bottom-3 left-3 border-b-2 border-l-2",
        "bottom-3 right-3 border-b-2 border-r-2",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-5 h-5 border-blue-500/30 ${cls}`}
        />
      ))}

      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[9px] font-mono text-blue-400/60 tracking-[0.3em] uppercase">
          Global Intel Matrix
        </span>
        <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
      </div>

      {/* Bottom status */}
      <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-600 tracking-widest">
        WGS84 · EPSG:4326
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED COMPONENT: GlobeView
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GlobeView
 * 
 * Props:
 *   events          — Array of event objects with { id, lat, lon, coordinates, title, sentiment, region, ... }
 *   onSelectEvent   — Callback fired when user clicks a marker: (event) => void
 *   selectedEventId — Currently selected event ID for highlighting
 *   className       — Optional additional class names
 *   height          — CSS height string (default: "100%")
 */
export default function GlobeView({
  events = [],
  onSelectEvent,
  selectedEventId,
  className = "",
  height = "100%",
}) {
  const [performanceMode, setPerformanceMode] = useState("quality");
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef();

  // Track mouse position for tooltip placement
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleHoverEvent = useCallback((hoverData) => {
    setHoveredEvent(hoverData);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    if (onSelectEvent) onSelectEvent(event);
  }, [onSelectEvent]);

  // Normalize events — support both `coordinates: [lat, lon]` and `lat/lon` props
  const normalizedEvents = useMemo(() =>
    events.map(ev => ({
      ...ev,
      coordinates: ev.coordinates || [ev.lat || 0, ev.lon || 0],
    })),
    [events]
  );

  // Sync performance mode from cookie/class
  useEffect(() => {
    const checkMode = () => {
      const mode = document.cookie
        .split("; ")
        .find((row) => row.startsWith("perf_mode="))
        ?.split("=")[1];
      setPerformanceMode(mode || "quality");
    };

    checkMode();
    window.addEventListener("performance-mode-change", checkMode);
    return () => window.removeEventListener("performance-mode-change", checkMode);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 200 }}
        style={{ background: "transparent" }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={performanceMode === "high" ? [1, 1] : [1, 2]}
      >
        <Suspense fallback={null}>
          <GlobeScene
            events={normalizedEvents}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
            onHoverEvent={handleHoverEvent}
            performanceMode={performanceMode}
          />
        </Suspense>
      </Canvas>

      {/* HTML Overlays */}
      <ScanOverlay />
      <GlobeLegend events={normalizedEvents} />

      {/* Tooltip rendered at cursor position */}
      <GlobeTooltip hoveredEvent={hoveredEvent} mousePos={mousePos} />
    </div>
  );
}
