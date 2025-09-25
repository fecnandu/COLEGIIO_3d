import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody, CapsuleCollider } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import * as THREE from "three";


const ALLOWED = new Set(["w", "a", "s", "d", " "]);

// Componente para el modelo del personaje


export default function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);

  const keys = useRef<{
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    " ": boolean;
    shift: boolean;
  }>({
    w: false,
    a: false,
    s: false,
    d: false,
    " ": false,
    shift: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (ALLOWED.has(e.key) || e.key === "Shift") {
        keys.current[e.key as keyof typeof keys.current] = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (ALLOWED.has(e.key) || e.key === "Shift") {
        keys.current[e.key as keyof typeof keys.current] = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(() => {
    const api = body.current;
    if (!api) return;

    const k = keys.current;
    let moveX = 0,
      moveZ = 0;
    if (k.w) moveZ -= 2;
    if (k.s) moveZ += 2;
    if (k.a) moveX -= 2;
    if (k.d) moveX += 2;

    // velocidad normal o corriendo
    const speed = k.shift ? 8 : 4;

    // Dirección relativa a cámara
    const direction = new THREE.Vector3(moveX, 0, moveZ);
    direction.applyQuaternion(camera.quaternion);
    direction.y = 0;
    if (direction.length() > 0) direction.normalize();

    const vel = api.linvel();

    // aplicar movimiento en XZ
    api.setLinvel(
      {
        x: direction.x * speed,
        y: vel.y,
        z: direction.z * speed,
      },
      true
    );

    // Rotar el modelo hacia la dirección del movimiento
    if (modelRef.current && (moveX !== 0 || moveZ !== 0)) {
      const angle = Math.atan2(direction.x, direction.z);
      modelRef.current.rotation.y = angle;
    }

    // 👇 salto (solo si estamos en el suelo)
    if (k[" "]) {
      // chequeo simple: si casi no hay velocidad vertical, asumimos que está en el suelo
      if (Math.abs(vel.y) < 1) {
        api.applyImpulse({ x: 0, y: 100, z: 0 }, true);
      }
      keys.current[" "] = false; // evita saltar varias veces por un solo toque
    }

    // cámara sigue al jugador
    const pos = api.translation();
    camera.position.set(pos.x, pos.y + 0.5, pos.z);
  });

  return (
    <RigidBody ref={body} mass={1} position={[0, 2, 0]} colliders={false}>
      <CapsuleCollider args={[0.6, 1]} />
      
      {/* Modelo del personaje - CORREGIDO PARA VERTICAL */}
      <group 
        ref={modelRef} 
        position={[0, -0.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]} // ← ¡ESTA ES LA CLAVE!
      >
       
      </group>
      
      {/* Mesh invisible para colisiones */}
      <mesh visible={false}>
        <capsuleGeometry args={[0.5, 1.2, 8, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}