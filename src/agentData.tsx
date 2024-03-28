import { Vector3 } from "three";

export interface agentData {
  mass: number;
  visibility: number;
  velocity: Vector3;
  speed: number;
  alive: number;
  index: number;
  debug: boolean;
}

export const defaultAgentData: agentData = {
  mass: 1,
  visibility: 50,
  velocity: new Vector3(0, 0, 0),
  speed: 1,
  alive: 0,
  index: 0,
  debug: false,
};
