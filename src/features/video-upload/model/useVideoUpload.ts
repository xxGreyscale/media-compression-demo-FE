import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { compressVideo } from "./compressVideo";
import type { CompressedOutput } from "./compressVideo";

export function useVideoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [durationInSeconds, setDurationInSeconds] = useState<number | null>(
    null,
  );
  const [compressedFiles, setCompressedFiles] =
    useState<CompressedOutput | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionError, setCompressionError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setDurationInSeconds(null);
    setCompressedFiles(null);
    setCompressionProgress(0);
    setCompressionError(null);
  };

  const onPreviewLoaded = (duration: number) => {
    setDurationInSeconds(duration);
  };

  const compressSelectedVideo = async () => {
    if (!selectedFile || isCompressing) {
      return;
    }

    setIsCompressing(true);
    setCompressionProgress(0);
    setCompressionError(null);

    try {
      const output = await compressVideo(selectedFile, (progress) => {
        setCompressionProgress(progress);
      });
      setCompressedFiles(output);
    } catch (error) {
      console.error("Compression error:", error);
      setCompressedFiles(null);
      setCompressionError(
        error instanceof Error ? error.message : "Compression failed.",
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadFile = (format: "mp4" | "webm") => {
    if (!compressedFiles) return;
    const file = compressedFiles[format];
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setDurationInSeconds(null);
    setCompressedFiles(null);
    setCompressionProgress(0);
    setCompressionError(null);
  };

  return {
    selectedFile,
    previewUrl,
    durationInSeconds,
    compressedFiles,
    isCompressing,
    compressionProgress,
    compressionError,
    onFileSelect,
    onPreviewLoaded,
    compressSelectedVideo,
    downloadFile,
    clearSelection,
  };
}
