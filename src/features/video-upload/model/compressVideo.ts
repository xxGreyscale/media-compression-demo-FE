import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

let ffmpegLoadPromise: Promise<FFmpeg> | null = null;

function getPublicAssetUrl(path: string) {
  return new URL(
    `${import.meta.env.BASE_URL}${path}`,
    globalThis.location.href,
  ).toString();
}

async function ensureFfmpegLoaded() {
  if (!ffmpegLoadPromise) {
    ffmpeg.on("log", ({ type, message }) => {
      console.log(`[FFmpeg ${type}] ${message}`);
    });

    ffmpegLoadPromise = (async () => {
      try {
        const coreURL = getPublicAssetUrl("ffmpeg/ffmpeg-core.js");
        const wasmURL = getPublicAssetUrl("ffmpeg/ffmpeg-core.wasm");

        await ffmpeg.load({ coreURL, wasmURL });

        return ffmpeg;
      } catch (error) {
        ffmpegLoadPromise = null;

        throw new Error(
          "Failed to load local FFmpeg assets. Run the build first so public/ffmpeg files are available.",
          { cause: error },
        );
      }
    })();
  }

  return ffmpegLoadPromise;
}

function getBaseName(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
}

export interface CompressedOutput {
  mp4: File;
  webm: File;
}

export async function compressVideo(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<CompressedOutput> {
  const inputName = file.name;
  const baseName = getBaseName(file.name);
  const mp4Output = `${baseName}-compressed.mp4`;
  const webmOutput = `${baseName}-compressed.webm`;

  const ffmpeg = await ensureFfmpegLoaded();

  if (ffmpeg == null) {
    throw new Error("FFmpeg instance is not available after loading.");
  }

  // Progress is split evenly: 0-50 for MP4, 50-100 for WebM.
  // While WebM is disabled MP4 maps to the full 0-100 range.
  let passOffset = 0;
  let passScale = 100;
  const progressHandler = ({ progress }: { progress: number }) => {
    if (onProgress) {
      const clamped = Math.min(1, Math.max(0, progress));
      onProgress(Math.round(passOffset + clamped * passScale));
    }
  };

  ffmpeg.on("progress", progressHandler);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Pass 1: MP4 (H.264 / AAC)
    passOffset = 0;
    const mp4ExitCode = await ffmpeg.exec([
      "-i",
      inputName,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "35",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-threads",
      "2",
      mp4Output,
    ]);

    if (mp4ExitCode !== 0) {
      console.error(
        `FFmpeg MP4 encoding failed with exit code ${mp4ExitCode}.`,
      );
      throw new Error(`FFmpeg MP4 encoding failed (exit code ${mp4ExitCode}).`);
    }

    // Pass 2: WebM (VP9 / Opus)
    // passOffset = 50;
    // passScale = 50;
    // const webmExitCode = await ffmpeg.exec([
    //   "-i",
    //   inputName,
    //   "-c:v",
    //   "libvpx-vp9",
    //   "-crf",
    //   "33",
    //   "-b:v",
    //   "0",
    //   // cpu-used 8 + deadline realtime are essential in WASM — without them
    //   // VP9 defaults to quality mode (cpu-used 1) which is impractically slow.
    //   "-cpu-used",
    //   "8",
    //   "-deadline",
    //   "realtime",
    //   "-c:a",
    //   "libopus",
    //   "-b:a",
    //   "128k",
    //   "-threads",
    //   "1",
    //   webmOutput,
    // ]);

    // if (webmExitCode !== 0) {
    //   console.error(`FFmpeg WebM encoding failed with exit code ${webmExitCode}.`);
    //   throw new Error(
    //     `FFmpeg WebM encoding failed (exit code ${webmExitCode}).`,
    //   );
    // }

    onProgress?.(100);

    const mp4Data = ((await ffmpeg.readFile(mp4Output)) as Uint8Array).slice();
    // const webmData = (
    //   (await ffmpeg.readFile(webmOutput)) as Uint8Array
    // ).slice();

    return {
      mp4: new File([mp4Data], mp4Output, {
        type: "video/mp4",
        lastModified: Date.now(),
      }),
      // WebM encoding is temporarily disabled — stub keeps the return type intact.
      webm: new File([], webmOutput, {
        type: "video/webm",
        lastModified: Date.now(),
      }),
    };
  } finally {
    ffmpeg.off("progress", progressHandler);
    try {
      await ffmpeg.deleteFile(inputName);
    } catch {
      /* ignore */
    }
    try {
      await ffmpeg.deleteFile(mp4Output);
    } catch {
      /* ignore */
    }
    try {
      await ffmpeg.deleteFile(webmOutput);
    } catch {
      /* ignore */
    }
  }
}
