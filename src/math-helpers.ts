import { MutableRefObject } from "react";
import { Vector3 } from "three";

const cone_dist = (absolute_distance: Vector3, direction: Vector3) => {
  return absolute_distance.dot(direction);
};

const cone_radius = (cone_dist: number, height: number, radius: number) => {
  return (cone_dist / height) * radius;
};

const orthogonal_distance = (
  absolute_distance: Vector3,
  cone_dist: number,
  direction: Vector3
) => {
  const radial_distance = direction.multiplyScalar(cone_dist);
  return new Vector3().subVectors(absolute_distance, radial_distance).length();
};

export const is_point_inside_cone = ({
  point,
  origin,
  direction,
  height = 50,
  radius = 40,
}: {
  point: Vector3;
  origin: Vector3;
  direction: Vector3;
  height?: number;
  radius?: number;
}) => {
  const coneOrigin = new Vector3().subVectors(
    origin,
    direction.normalize().multiplyScalar(16)
  );
  const absolute_distance = new Vector3().subVectors(point, coneOrigin);
  const axial_dist = cone_dist(absolute_distance, direction.normalize());
  if (axial_dist < 14 || axial_dist > height) return false;
  const radius_at_dist = cone_radius(axial_dist, height, radius);
  const radial_dist = orthogonal_distance(
    absolute_distance,
    axial_dist,
    direction.normalize()
  );
  return radial_dist < radius_at_dist;
};
