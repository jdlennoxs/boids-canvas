import { createRoot } from "react-dom/client";
import { CanvasContainer } from ".";

createRoot(document.getElementById("root") as HTMLElement).render(
  <CanvasContainer count={200} />
);
