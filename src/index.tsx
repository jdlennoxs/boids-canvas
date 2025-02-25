import { Canvas } from "@react-three/fiber";
import Scene from "./scene";
import { useState } from "react";
import './CanvasContainer.css';

export type ColorValueHex = `#${string}` | string;

export interface OptionsInterface {
  backgroundColor?: ColorValueHex;
  lightColor?: ColorValueHex;
  fogColor?: ColorValueHex;
  boidColor?: ColorValueHex | string;
  highlight?: ColorValueHex;
  count?: number;
  showSliders?: Boolean;
  useOrbitControls?: Boolean;
  duration?: number;
  avoid?: boolean;
}

export const defaultOptions: OptionsInterface = {
  backgroundColor: "#5162FF",
  lightColor: "#FFFCEC",
  fogColor: "#9DA7FF",
  boidColor: "turquoise",
  highlight: "pink",
  count: 500,
  showSliders: true,
  useOrbitControls: true,
  duration: 60,
  avoid: false,
};
export function CanvasContainer(props: OptionsInterface) {
  const [forces] = useState({
    separation: 1,
    cohesion: 1,
    alignment: 0.5,
    goal: 0.5
  });

  const updateForce = (force: keyof typeof forces) => (e: React.ChangeEvent<HTMLInputElement>) => {
    forces[force] = parseFloat(e.target.value);
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Canvas style={{ height: "100%", background: props.backgroundColor }}>
        <Scene
          {...props}
          forces={forces}
          avoidance
        />
      </Canvas>
      {props.showSliders && (
        <div className="slider-container">
          <div className="slider">
            <input
              type="range"
              min="0"
              max="2"
              step=".1"
              defaultValue={forces.separation}
              onChange={updateForce('separation')}
            />
            <label>Separation</label>
          </div>
          <div className="slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={forces.cohesion}
              onChange={updateForce('cohesion')}
            />
            <label>Cohesion</label>
          </div>
          <div className="slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={forces.alignment}
              onChange={updateForce('alignment')}
            />
            <label>Alignment</label>
          </div>
          <div className="slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={forces.goal}
              onChange={updateForce('goal')}
            />
            <label>Goal</label>
          </div>
        </div>
      )}
    </div>
  );
}

CanvasContainer.defaultProps = defaultOptions;
