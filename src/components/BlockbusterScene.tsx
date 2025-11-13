"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Float, Html, OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

type Movie = {
  title: string;
  color: string;
};

type ShelfConfig = {
  position: [number, number, number];
  rotation?: [number, number, number];
  movies: Movie[];
};

const FEATURED_MOVIES: Movie[] = [
  { title: "The Last Premiere", color: "#ffc107" },
  { title: "Nebula Knights", color: "#29b6f6" },
  { title: "Retro Rampage", color: "#ec407a" },
  { title: "Video Vault", color: "#ab47bc" },
  { title: "Counter Culture", color: "#4fc3f7" }
];

const SHELVES: ShelfConfig[] = [
  {
    position: [-6, 0, -4],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Action ${i + 1}`,
      color: i % 2 === 0 ? "#1e88e5" : "#1565c0"
    }))
  },
  {
    position: [-2, 0, -4],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Comedy ${i + 1}`,
      color: i % 3 === 0 ? "#ffb300" : "#f57c00"
    }))
  },
  {
    position: [2, 0, -4],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Sci-Fi ${i + 1}`,
      color: i % 2 === 0 ? "#26a69a" : "#00897b"
    }))
  },
  {
    position: [6, 0, -4],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Drama ${i + 1}`,
      color: i % 2 === 0 ? "#d81b60" : "#c2185b"
    }))
  },
  {
    position: [-6, 0, 4],
    rotation: [0, Math.PI, 0],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Classics ${i + 1}`,
      color: i % 2 === 0 ? "#ff7043" : "#ffa726"
    }))
  },
  {
    position: [-2, 0, 4],
    rotation: [0, Math.PI, 0],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Thriller ${i + 1}`,
      color: i % 2 === 0 ? "#9c27b0" : "#7b1fa2"
    }))
  },
  {
    position: [2, 0, 4],
    rotation: [0, Math.PI, 0],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Family ${i + 1}`,
      color: i % 2 === 0 ? "#8bc34a" : "#689f38"
    }))
  },
  {
    position: [6, 0, 4],
    rotation: [0, Math.PI, 0],
    movies: Array.from({ length: 18 }, (_, i) => ({
      title: `Horror ${i + 1}`,
      color: i % 2 === 0 ? "#ff5252" : "#e53935"
    }))
  }
];

const CUSTOMER_PATH_POINTS: [number, number, number][] = [
  [-8, 0.05, -6],
  [-5, 0.05, 0],
  [-1, 0.05, 2],
  [3, 0.05, -1],
  [7, 0.05, 5]
];

function MovieCase({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.4, 0.6, 0.1]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

function Shelf({ position, rotation = [0, 0, 0], movies }: ShelfConfig) {
  const frameColor = "#1a237e";
  const shelfColor = "#283593";

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[2.8, 3.6, 0.4]} />
        <meshStandardMaterial color={frameColor} metalness={0.2} roughness={0.7} />
      </mesh>

      {[ -1, 0, 1 ].map((level) => (
        <mesh key={level} position={[0, 1.2 + level * 0.8, 0]} receiveShadow>
          <boxGeometry args={[2.9, 0.12, 0.48]} />
          <meshStandardMaterial color={shelfColor} roughness={0.6} />
        </mesh>
      ))}

      {movies.map((movie, index) => {
        const column = index % 6;
        const row = Math.floor(index / 6);
        const x = -1.1 + column * 0.44;
        const y = 1.5 - row * 0.8;
        return <MovieCase key={`${movie.title}-${index}`} position={[x, y, 0.2]} color={movie.color} />;
      })}

      <Text
        position={[0, 2.6, 0.25]}
        rotation={[-Math.PI / 2.3, 0, 0]}
        fontSize={0.35}
        letterSpacing={0.05}
        color="#ffee58"
        font="https://fonts.gstatic.com/s/rajdhani/v16/LDI1apCSOBgXnGbX8Eo.ttf"
      >
        BLOCKBUSTER
      </Text>
    </group>
  );
}

function CustomerPath() {
  const lineRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    lineRef.current.scale.set(scale, scale, scale);
  });

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(CUSTOMER_PATH_POINTS.map((point) => new THREE.Vector3(...point)));
  }, []);

  const points = useMemo(() => curve.getPoints(100), [curve]);

  return (
    <mesh ref={lineRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <tubeGeometry args={[curve, 80, 0.05, 8, false]} />
      <meshStandardMaterial
        color="#ffeb3b"
        emissive="#f9a825"
        emissiveIntensity={1.5}
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  );
}

function CheckoutCounter() {
  return (
    <group position={[0, 0, 8]}>
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[6, 1.5, 2]} />
        <meshStandardMaterial color="#1b1f3b" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 1.5, -0.4]}>
        <boxGeometry args={[2.5, 0.3, 1]} />
        <meshStandardMaterial color="#263055" roughness={0.4} metalness={0.3} />
      </mesh>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Text
          position={[0, 2.2, 0.2]}
          fontSize={0.7}
          color="#ffeb3b"
          letterSpacing={0.08}
          font="https://fonts.gstatic.com/s/bungeeinline/v14/DtVudNOFXWhU4C6h7GkgbVuE.woff"
        >
          CHECKOUT
        </Text>
      </Float>
    </group>
  );
}

function StoreShell() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[30, 0.02, 30]} />
        <meshStandardMaterial color="#0d1335" roughness={0.8} />
      </mesh>
      <mesh receiveShadow position={[0, 3.5, -15]}>
        <planeGeometry args={[30, 7]} />
        <meshStandardMaterial color="#12194a" />
      </mesh>
      <mesh receiveShadow position={[0, 3.5, 15]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[30, 7]} />
        <meshStandardMaterial color="#11173f" />
      </mesh>
      <mesh receiveShadow position={[-15, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 7]} />
        <meshStandardMaterial color="#101538" />
      </mesh>
      <mesh receiveShadow position={[15, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 7]} />
        <meshStandardMaterial color="#101538" />
      </mesh>
    </group>
  );
}

function NeonBanner() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.15 + 0.85;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
      <group position={[0, 4.2, -2]}>
        <mesh ref={ref}>
          <torusGeometry args={[3.5, 0.12, 16, 100]} />
          <meshStandardMaterial
            color="#29b6f6"
            emissive="#29b6f6"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 0, 0.3]}
          fontSize={1.2}
          color="#ffeb3b"
          letterSpacing={0.12}
          font="https://fonts.gstatic.com/s/bungee/v14/N0bU2SZBIuF2PU_0ImZP.ttf"
        >
          BLOCKBUSTER VIDEO
        </Text>
      </group>
    </Float>
  );
}

function Spotlight({ position, target }: { position: [number, number, number]; target: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetObject = useMemo(() => new THREE.Object3D(), []);

  targetObject.position.set(...target);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const wiggle = Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
    lightRef.current.angle = 0.6 + wiggle * 0.1;
  });

  return (
    <>
      <primitive object={targetObject} />
      <spotLight
        ref={lightRef}
        position={position}
        intensity={1.2}
        angle={0.6}
        penumbra={0.4}
        distance={30}
        decay={1.4}
        castShadow
        target={targetObject}
      />
    </>
  );
}

function FeaturedDisplay() {
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[4, 1.2, 2]} />
        <meshStandardMaterial color="#1f2a62" roughness={0.7} />
      </mesh>
      <group position={[0, 1.6, 0.9]}>
        {FEATURED_MOVIES.map((movie, index) => (
          <group key={movie.title} position={[index * 0.8 - 1.6, 0, 0]}>
            <Float speed={1.5} floatIntensity={0.25} rotationIntensity={0.3}>
              <mesh castShadow>
                <boxGeometry args={[0.55, 0.8, 0.15]} />
                <meshStandardMaterial
                  color={movie.color}
                  emissive={movie.color}
                  emissiveIntensity={0.35}
                  roughness={0.3}
                />
              </mesh>
            </Float>
            <Text
              position={[0, -0.75, 0]}
              fontSize={0.22}
              maxWidth={1}
              textAlign="center"
              lineHeight={1.1}
              color="#ffffff"
            >
              {movie.title}
            </Text>
          </group>
        ))}
      </group>
      <Text position={[0, 1.2, -0.2]} fontSize={0.4} color="#ffeb3b" letterSpacing={0.08}>
        FEATURED RENTALS
      </Text>
    </group>
  );
}

function AmbientDetails() {
  return (
    <group>
      <Stars radius={200} depth={60} count={4000} factor={4} saturation={0} fade speed={1} />
      <spotLight position={[0, 8, 4]} angle={0.6} intensity={0.4} penumbra={0.6} />
      <HemisphereLights />
      <PointOrbs />
    </group>
  );
}

function HemisphereLights() {
  return <hemisphereLight args={["#ffe082", "#1a237e", 0.6]} position={[0, 4, 0]} />;
}

function PointOrbs() {
  const colors = ["#ffcd38", "#42a5f5", "#ab47bc"];
  return (
    <group>
      {colors.map((color, index) => (
        <Float key={color} speed={0.6 + index * 0.2} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh position={[index * 2 - 2, 3.5, -3]} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function SceneOverlay() {
  return (
    <Html position={[0, 3.8, -6]} center distanceFactor={18} transform>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(33,53,138,0.92) 0%, rgba(5,9,36,0.92) 100%)",
          border: "1px solid rgba(255,235,59,0.2)",
          padding: "16px 20px",
          minWidth: "240px",
          borderRadius: "14px",
          color: "#fff",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 25px rgba(2,5,21,0.35)"
        }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "6px", letterSpacing: "0.08em" }}>NEW RELEASES</h2>
        <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
          Reserve the hottest titles before the weekend rush. Unlimited popcorn refills with every rental.
        </p>
      </div>
    </Html>
  );
}

export default function BlockbusterScene() {
  return (
    <main>
      <Canvas
        shadows
        camera={{ position: [0, 6, 14], fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#050816"]} />
        <fog attach="fog" args={["#050816", 15, 45]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.6}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={60}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <Spotlight position={[-7, 6, 6]} target={[0, 0, 0]} />
          <Spotlight position={[7, 6, -6]} target={[0, 0, 0]} />
          <StoreShell />
          <NeonBanner />
          <FeaturedDisplay />
          <CheckoutCounter />
          <CustomerPath />
          <SceneOverlay />
          {SHELVES.map((shelf) => (
            <Shelf key={`${shelf.position.join("-")}`} {...shelf} />
          ))}
          <AmbientDetails />
        </Suspense>
        <OrbitControls
          enablePan={false}
          maxDistance={26}
          minDistance={8}
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      <aside
        style={{
          position: "absolute",
          inset: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none"
        }}
      >
        <section style={{ pointerEvents: "auto", alignSelf: "flex-start" }}>
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "12px",
              background: "rgba(5,9,36,0.65)",
              padding: "18px 22px",
              borderRadius: "18px",
              border: "1px solid rgba(41, 182, 246, 0.35)",
              boxShadow: "0 12px 32px rgba(2,5,21,0.45)",
              backdropFilter: "blur(14px)"
            }}
          >
            <h1 style={{ fontSize: "2.1rem", letterSpacing: "0.12em" }}>BLOCKBUSTER 3000</h1>
            <p style={{ maxWidth: "320px", lineHeight: 1.45, fontSize: "0.95rem", opacity: 0.9 }}>
              Wander through neon aisles, browse vibrant VHS walls, and feel the late-night rush of securing the
              perfect movie marathon lineup.
            </p>
          </div>
        </section>
        <section style={{ pointerEvents: "auto", alignSelf: "flex-end", textAlign: "right" }}>
          <div
            style={{
              display: "inline-flex",
              gap: "14px",
              padding: "12px 18px",
              alignItems: "center",
              background: "rgba(10,15,46,0.7)",
              borderRadius: "16px",
              border: "1px solid rgba(255,235,59,0.3)",
              boxShadow: "0 8px 22px rgba(2,5,21,0.35)",
              backdropFilter: "blur(12px)"
            }}
          >
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.08em", opacity: 0.9 }}>
              OPEN ALL NIGHT · SNACK BAR IN REWIND LOUNGE
            </span>
          </div>
        </section>
      </aside>
    </main>
  );
}
