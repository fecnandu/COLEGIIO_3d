import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./components/Player";
import { useGLTF, PointerLockControls, Environment } from "@react-three/drei";

function Colegio() {
  const { scene } = useGLTF("/colegio.glb");
  return <primitive object={scene} scale={1} />;
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 10, 15], fov: 75 }}>
      {/* 🔦 Luces */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.8} />
      <hemisphereLight args={["#ffffff", "#444444", 0.6]} />

      {/* 🌅 Fondo HDRI personalizado */}
      <Environment
        files="/derelict_airfield_02_4k.exr"  // 👈 asegúrate que esté en /public
        background
      />

      <Physics gravity={[0, -9.8, 0]}>
        {/* Piso */}
        <RigidBody type="fixed">
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="lightgreen" />
          </mesh>
        </RigidBody>

        {/* Colegio */}
        <RigidBody type="fixed">
          <Colegio />
        </RigidBody>

        {/* Jugador */}
        <Player />
      </Physics>

      {/* Cámara FPS */}
      <PointerLockControls />
    </Canvas>
  );
}
