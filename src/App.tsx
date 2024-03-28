import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Flock } from "./flock";
import { useFrame, useThree } from "@react-three/fiber";

function App({ debug }) {
  useFrame((state) => {
    if (state.clock.elapsedTime > 60) {
      state.setFrameloop("never");
    }
  });
  return (
    <Suspense fallback={null}>
      {debug && <axesHelper scale={[10, 10, 20]} />}
      <PerspectiveCamera
        position={[0, 50, 50]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={70}
        makeDefault
      />
      <ambientLight intensity={0.8} color={"#FFFCEC"} />
      <pointLight position={[0, 40, 50]} intensity={0.5} />
      <fog attach="fog" args={["#9DA7FF", 80, 150]} />
      <Flock count={300} distance={100} />
    </Suspense>
  );
}

export default App;
