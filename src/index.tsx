import { Canvas } from "@react-three/fiber";
import Scene from "./scene";

export type ColorValueHex = `#${string}` | string;

export interface OptionsInterface {
  backgroundColor: ColorValueHex;
  lightColor: ColorValueHex;
  fogColor: ColorValueHex;
  boidColor: ColorValueHex;
  count: number;
}

export const defaultOptions: OptionsInterface = {
  backgroundColor: "#5162FF",
  lightColor: "#FFFCEC",
  fogColor: "#9DA7FF",
  boidColor: "turquoise",
  count: 300,
};

function CanvasContainer(props: OptionsInterface) {
  return (
    <Canvas style={{ height: "100%", background: props.backgroundColor }}>
      <Scene {...props} />
    </Canvas>
  );
}

CanvasContainer.defaultProps = defaultOptions;

export default CanvasContainer;
