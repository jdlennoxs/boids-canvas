import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { Flock } from "./flock";
import { OptionsInterface } from ".";

interface SceneInterface extends OptionsInterface {
  debug?: boolean;
}

function Scene({ debug, ...props }: SceneInterface) {
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
      <ambientLight intensity={0.8} color={props.lightColor} />
      <pointLight position={[0, 40, 50]} intensity={0.5} />
      <fog attach="fog" args={[props.fogColor, 80, 150]} />
      <Flock
        count={props.count}
        distance={100}
        options={{ boidColor: props.boidColor }}
      />
    </Suspense>
  );
}

export default Scene;
