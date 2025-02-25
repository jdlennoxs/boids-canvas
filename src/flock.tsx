import { useRef } from "react";
import { Vector3 } from "three";
import { defaultAgentData } from "./agentData";
import { circularMotion, flockingMotion } from "./flight";
import PaperBoid from "./paper-boid";
import { OptionsInterface } from ".";

export const Flock = ({
  count,
  distance,
  debug,
  options,
  forces,
}: {
  count: number;
  distance: number;
  debug?: boolean;
  options: OptionsInterface;
  forces: any;
}) => {
  const group = useRef<THREE.Group>(null!);

  return (
    <group ref={group} name="flock" dispose={null}>
      {[...Array(count)].map((value, index) => {
        const mass = 1 + Math.random();
        const visibility = 20 + 10 * mass;
        const velocity = new Vector3(
          Math.random(),
          Math.random() / 4,
          -Math.random()
        );
        // const velocity = new Vector3(0, 0, -1);
        return (
          <PaperBoid
            key={index}
            color={index === 1 ? options.highlight! : options.boidColor!}
            position={[
              Math.random() * distance - distance / 2,
              Math.random() * 50,
              distance - (index / count) * 50,
            ]}
            // position={[index * index * 2, 0, index * 2]}
            motion={flockingMotion({
              distance,
              forces,
              avoid: options.avoid!,
            })}
            agentData={{
              ...defaultAgentData,
              mass,
              visibility,
              velocity,
              speed: index === 1 ? mass / 3 : mass / 4,
              index,
              debug: debug && index === 1 ? true : false,
            }}
          />
        );
      })}
    </group>
  );
};
