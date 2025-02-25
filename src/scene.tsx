import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { Flock } from "./flock";
import { OptionsInterface } from ".";

export interface SceneInterface extends OptionsInterface {
  debug?: boolean;
  forces: {
    separation: number;
    cohesion: number;
    alignment: number;
    goal: number;
  };
}

function Scene({ debug, ...props }: SceneInterface) {
  useFrame((state) => {
    if (state.clock.elapsedTime > props.duration!) {
      state.setFrameloop("never");
    }
  });
  return (
    <Suspense fallback={null}>
      {debug && <axesHelper scale={[10, 10, 20]} />}
      <PerspectiveCamera
        position={[0, 25, 50]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={70}
        makeDefault
      />
      {props.useOrbitControls && <OrbitControls />}
      <ambientLight intensity={0.8} color={props.lightColor!} />
      <pointLight position={[0, 40, 50]} intensity={0.5} />
      <fog attach="fog" args={[props.fogColor!, 90, 120]} />
      <Flock
        debug={debug}
        count={props.count!}
        distance={100}
        options={{ boidColor: props.boidColor!, highlight: props.highlight! }}
        forces={props.forces}
      />
    </Suspense>
  );
}

export default Scene;
