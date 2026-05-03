#!/usr/bin/env node

import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function main() {
  const outDir = resolve(process.cwd(), "public/ffmpeg");
  await mkdir(outDir, { recursive: true });

  const umdCoreJs = require.resolve("@ffmpeg/core");
  const distDir = dirname(dirname(umdCoreJs));
  const esmDir = join(distDir, "esm");

  const coreJs = join(esmDir, "ffmpeg-core.js");
  const coreWasm = join(esmDir, "ffmpeg-core.wasm");

  await copyFile(coreJs, join(outDir, "ffmpeg-core.js"));
  await copyFile(coreWasm, join(outDir, "ffmpeg-core.wasm"));

  console.log(`Copied ffmpeg assets to ${outDir}`);
  console.log(`js: ${coreJs}`);
  console.log(`wasm: ${coreWasm}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
