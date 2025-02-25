import { MutableRefObject } from "react";
import { Object3D, Vector3 } from "three";
import { is_point_inside_cone, is_point_inside_sphere } from "./math-helpers";
import { agentData } from "./agentData";

export interface MotionInterface {
  radius?: number;
  ref: MutableRefObject<any>;
  goal?: [x: number, y: number] | undefined;
  delta: number;
}

export const circularMotion = ({ radius = 40, ref }: MotionInterface) => {
  const increment = ref.current.userData.alive;
  const getPositionForT = (increment: number) =>
    new Vector3(
      (Math.sin(increment) * radius) / (3 / 2),
      (Math.sin(increment * 2) * radius) / 4,
      Math.cos(increment) * radius
    );
  const velocity = getPositionForT(increment);
  const previousPosition = { ...ref.current.position };
  const direction = new Vector3()
    .subVectors(velocity, previousPosition)
    .normalize();
  ref.current.position.x = velocity.x;
  ref.current.position.y = velocity.y;
  ref.current.position.z = velocity.z;
  ref.current.lookAt(new Vector3().addVectors(ref.current.position, direction));
};

export const flockingMotion =
  ({
    distance,
    forces,
    speedMultiplier = 40.0,
    avoid = false,
  }: {
    distance: number;
    avoid: boolean;
    forces: {
      separation: number;
      cohesion: number;
      alignment: number;
      goal: number;
    };
    speedMultiplier?: number;
  }) =>
    ({ ref, goal: [x, y] = [0, distance], delta }: MotionInterface) => {
      const { visibility, debug, velocity, speed, index, mass } = ref.current
        .userData as agentData;
      const { position } = ref.current;
      const flock = ref.current.parent.children;
      const neighbours = [];

      const force = new Vector3();
      const cohesion = new Vector3();
      const alignment = new Vector3();
      const separation = new Vector3();
      const avoidance = new Vector3();
      // Helper function to determine visibility
      const isVisible = (boid: THREE.Mesh, i: number) => {
        if (i === index) return false;
        const proximity = is_point_inside_sphere({
          point: boid.position,
          origin: position,
          radius: visibility,
        });
        if (!proximity) return false;
        return !is_point_inside_cone({
          point: boid.position,
          origin: position,
          direction: new Vector3().copy(velocity).negate().normalize(),
          height: visibility,
          radius: visibility * 2,
        });
      };

      // Find neighbours
      flock.forEach((boid: THREE.Mesh, i: number) => {
        if (isVisible(boid, i)) {
          neighbours.push(i);
          cohesion.add(flock[i].position);
          alignment.add(flock[i].userData.velocity);
          const distance = position.distanceTo(flock[i].position);
          const strength = 1 - distance / visibility;
          const offset = new Vector3().add(position).sub(flock[i].position);
          separation.add(offset.multiplyScalar(strength));
          if (avoid && i === 1) {
            const obstacle = flock[i].position;
            const avoid = position.distanceTo(obstacle);
            const strength = 1 - avoid / visibility;
            const offset = new Vector3().add(position).sub(obstacle);
            avoidance.add(offset.multiplyScalar(strength));
            force.add(avoidance.normalize().multiplyScalar(forces.separation / 2));
          }
          if (debug) {
            flock[index].material.color.set("pink");
            flock[i].material.color.set(isVisible(boid, i) ? "coral" : "turquoise");
          }
        }
      });

      if (neighbours.length) {
        force.add(separation.normalize().multiplyScalar(forces.separation));
        force.add(cohesion.divideScalar(neighbours.length).sub(position).normalize().multiplyScalar(forces.cohesion));
        force.add(alignment.divideScalar(neighbours.length).normalize().sub(velocity).multiplyScalar(forces.alignment));

        force.add(new Vector3(x * distance * 2, y * distance + 25, -distance * 2)
          .sub(position)
          .normalize()
          .divideScalar(mass)
          .multiplyScalar(forces.goal));
      }


      // Scale forces by delta and speedMultiplier to ensure frame-rate independence
      force.multiplyScalar(delta * speedMultiplier);

      // Ensure minimum forward velocity
      const forwardVelocity = velocity.clone().normalize().multiplyScalar(speed * (neighbours.length ? 0.1 : 0.2) * delta * speedMultiplier);
      force.add(forwardVelocity);

      const desiredVelocity = velocity.clone()
        .add(force)
        .normalize()
        .multiplyScalar(speed);

      // Smooth velocity changes with higher interpolation factor
      velocity.lerp(desiredVelocity, mass / 5 * delta * speedMultiplier)
        .clampLength(speed * 0.4, speed).divideScalar(0.9);

      // Add a small random factor to the velocity for floatiness
      velocity.x += (Math.random() - 0.5) * 0.01;
      velocity.y += (Math.random() - 0.5) * 0.03;
      velocity.z += (Math.random() - 0.5) * 0.01;

      // Boundary conditions
      if (Math.abs(ref.current.position.z) > distance) {
        ref.current.position.z = -ref.current.position.z;
      }
      if (Math.abs(ref.current.position.y) > distance / 2) {
        velocity.y = ref.current.position.y > 0 ? -Math.abs(velocity.y) : Math.abs(velocity.y);
      }
      if (Math.abs(ref.current.position.x) > distance * 2) {
        ref.current.position.x = -ref.current.position.x;
      }

      ref.current.position.x += velocity.x * delta * speedMultiplier;
      ref.current.position.y += velocity.y * delta * speedMultiplier;
      ref.current.position.z += velocity.z * delta * speedMultiplier;

      const mock = new Object3D();
      ref.current.parent.add(mock);
      mock.position.copy(ref.current.position);

      // Ensure the target is always in front of the bird
      const target = new Vector3().addVectors(ref.current.position, velocity.clone().normalize().multiplyScalar(10));
      mock.lookAt(target);
      const targetQuaternion = mock.quaternion.clone();
      ref.current.parent.remove(mock);

      // Increase the interpolation factor for smoother rotation
      ref.current.quaternion.slerp(targetQuaternion, 0.1);

      // Add damping to the velocity changes
      velocity.lerp(velocity, 0.98).clampLength(speed * 0.4, speed);
    };
