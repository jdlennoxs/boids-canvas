import { Canvas } from "@react-three/fiber";
import Scene from "./scene";

export type ColorValueHex = `#${string}` | string;

export interface OptionsInterface {
  backgroundColor: ColorValueHex;
  lightColor: ColorValueHex;
  fogColor: ColorValueHex;
  boidColor: ColorValueHex;
  highlight: ColorValueHex;
  count: number;
}

export const defaultOptions: OptionsInterface = {
  backgroundColor: "#5162FF",
  lightColor: "#FFFCEC",
  fogColor: "#9DA7FF",
  boidColor: "turquoise",
  highlight: "pink",
  count: 300,
};

export function CanvasContainer(props: OptionsInterface) {
  return (
    <Canvas style={{ height: "100%", background: props.backgroundColor }}>
      <Scene {...props} />
    </Canvas>
  );
}

CanvasContainer.defaultProps = defaultOptions;
