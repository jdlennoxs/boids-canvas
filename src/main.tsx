import { createRoot } from "react-dom/client";
import { CanvasContainer } from ".";

createRoot(document.getElementById("root") as HTMLElement).render(
  <div style={{ height: "500px" }}>
    <CanvasContainer count={250} />
  </div>
);
