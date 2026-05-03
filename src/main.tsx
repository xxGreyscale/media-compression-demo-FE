import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./app/router/AppRouter";
import { configureVideoUtils } from "@your-org/video-utils";

configureVideoUtils({
  ffmpegBaseUrl: `${import.meta.env.BASE_URL}ffmpeg/`,
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
