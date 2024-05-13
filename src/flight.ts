import { MutableRefObject } from "react";
import { Object3D, Vector3 } from "three";
import { is_point_inside_cone } from "./math-helpers";
import { agentData } from "./agentData";

export interface MotionInterface {
  radius?: number;
  ref: MutableRefObject<any>;
  goal?: [x: number, y: number] | undefined;
}

export const circularMotion = ({ radius = 20, ref }: MotionInterface) => {
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
  ({ distance }: { distance: number }) =>
  ({ ref, goal: [x, y] = [0, distance] }: MotionInterface) => {
    const { visibility, velocity, debug, speed, index, mass } = ref.current
      .userData as agentData;
    const { position } = ref.current;
    const flock = ref.current.parent.children;
    const neighbours = [];

    const force = new Vector3();
    const cohesion = new Vector3();
    const alignment = new Vector3();
    const separation = new Vector3();
    // Find neighbours
    flock.forEach((boid: THREE.Mesh, i: number) => {
      if (i !== index) {
        const visible = is_point_inside_cone({
          point: boid.position,
          origin: position,
          direction: velocity,
          height: visibility,
          radius: 30 * visibility,
        });
        if (debug) {
          flock[index].material.color.set("pink");
          if (visible) {
            flock[i].material.color.set("0xff0000");
          } else {
            flock[i].material.color.set("turquoise");
          }
        }
        if (visible) {
          neighbours.push(i);
          cohesion.add(flock[i].position);
          alignment.add(flock[i].userData.velocity);

          const distance = position.distanceTo(flock[i].position);

          if (distance <= 20) {
            const offset = new Vector3().add(position).sub(flock[i].position);
            separation.add(offset.normalize().divideScalar(distance));
          }
        }
      }
    });

    if (neighbours.length) {
      force.add(
        separation
          .divideScalar(neighbours.length)
          .normalize()
          .multiplyScalar(speed)
          .divideScalar(1 / mass)
          .sub(velocity)
          .clampLength(0, 0.35)
      );
      force.add(
        cohesion
          .divideScalar(neighbours.length)
          .sub(position)
          .normalize()
          .multiplyScalar(speed)
          .sub(velocity)
          .clampLength(0, 0.35)
      );
      force.add(
        alignment
          .divideScalar(neighbours.length)
          .normalize()
          .multiplyScalar(speed)
          .multiplyScalar(mass)
          .sub(velocity)
          .clampLength(0, 0.09)
      );
      force.add(
        new Vector3(x * distance * 2, y * (distance / 2), -distance * 2)
          .sub(position)
          .normalize()
          .multiplyScalar(speed)
          .divideScalar(mass)
          .clampLength(0, 0.12)
      );
    }

    velocity.add(force).clampLength(speed, speed);

    if (Math.abs(ref.current.position.z) > distance) {
      ref.current.position.z = -ref.current.position.z;
    }
    if (Math.abs(ref.current.position.y) > distance / 2) {
      velocity.y = -velocity.y;
    }
    if (Math.abs(ref.current.position.x) > distance * 2) {
      ref.current.position.x = -ref.current.position.x;
    }

    ref.current.position.x += velocity.x;
    ref.current.position.y += velocity.y;
    ref.current.position.z += velocity.z;
    const mock = new Object3D();

    ref.current.parent.add(mock);
    mock.position.copy(ref.current.position);

    const target = new Vector3().addVectors(ref.current.position, velocity);

    mock.lookAt(target);
    const targetQuaternion = mock.quaternion.clone();

    ref.current.parent.remove(mock);
    ref.current.quaternion.slerp(targetQuaternion, 0.1);
  };
