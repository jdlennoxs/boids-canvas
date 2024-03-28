import { Canvas } from "@react-three/fiber";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Canvas style={{ height: "100%", background: "#5162FF" }}>
    <App />
  </Canvas>
);
