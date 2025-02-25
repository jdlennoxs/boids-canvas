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
  const absolute_distance = new Vector3().subVectors(point, origin);
  const axial_dist = cone_dist(absolute_distance, direction);
  if (axial_dist < 0 || axial_dist > height) return false;

  const radius_at_dist = cone_radius(axial_dist, height, radius);
  const radial_dist = orthogonal_distance(
    absolute_distance,
    axial_dist,
    direction
  );
  return radial_dist < radius_at_dist;
};

export const is_point_inside_sphere = ({
  point,
  origin,
  radius = 40,
}: {
  point: Vector3;
  origin: Vector3;
  radius?: number;
}) => {
  return (
    Math.pow(point.x - origin.x, 2) +
      Math.pow(point.y - origin.y, 2) +
      Math.pow(point.z - origin.z, 2) <
    Math.pow(radius, 2)
  );
};
