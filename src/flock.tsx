import { useRef } from "react";
import { Vector3 } from "three";
import { defaultAgentData } from "./agentData";
import { flockingMotion } from "./flight";
import PaperBoid from "./paper-boid";
import { OptionsInterface } from ".";

export const Flock = ({
  count,
  distance,
  debug,
  options,
}: {
  count: number;
  distance: number;
  debug?: boolean;
  options: any;
}) => {
  const group = useRef<THREE.Group>(null!);

  return (
    <group ref={group} name="flock" dispose={null}>
      {[...Array(count)].map((value, index) => {
        const mass = 1 + Math.random();
        const visibility = 50 + 10 * mass;
        const velocity = new Vector3(
          Math.random(),
          Math.random() / 3,
          -Math.random()
        );
        return (
          <PaperBoid
            key={index}
            color={options.boidColor}
            position={[
              (Math.random() - 1) * distance,
              (Math.random() - 1) * 50,
              Math.max(distance - index, distance),
            ]}
            motion={flockingMotion({ distance })}
            agentData={{
              ...defaultAgentData,
              mass,
              visibility,
              velocity,
              speed: mass / 4,
              index,
              debug: debug && index === 0 ? true : false,
            }}
          />
        );
      })}
    </group>
  );
};
