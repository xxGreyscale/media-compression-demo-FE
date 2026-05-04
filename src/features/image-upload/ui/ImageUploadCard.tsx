import { useEffect, useRef, useState } from "react";
import { formatFileSize } from "../../../shared/lib/video";
import { useImageUpload } from "../model/useImageUpload";
import "./ImageUploadCard.css";

type ImageOutputFormat = "webp" | "jpeg" | "png";

const FORMAT_OPTIONS: { value: ImageOutputFormat; label: string }[] = [
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
];

export function ImageUploadCard() {
  const {
    selectedFile,
    previewUrl,
    compressedFiles,
    isCompressing,
    compressionProgress,
    compressionError,
    onFileSelect,
    compressSelectedImage,
    downloadFile,
    getAvailableFormats,
    clearSelection,
  } = useImageUpload();

  const [selectedFormats, setSelectedFormats] = useState<ImageOutputFormat[]>(["webp"]);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const formatMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node)) {
        setIsFormatMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleFormat(format: ImageOutputFormat) {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format],
    );
  }

  const availableFormats = compressedFiles ? getAvailableFormats() : [];

  let compressionFeedback = "Select an image and hit Compress to produce optimised outputs.";

  if (compressionError) {
    compressionFeedback = compressionError;
  } else if (compressedFiles) {
    compressionFeedback = "Compression complete — download your preferred format below.";
  } else if (isCompressing) {
    compressionFeedback = "Encoding in progress…";
  }

  return (
    <section className="image-upload surface-panel">
      <div className="image-upload__header">
        <p className="image-upload__eyebrow">Image compression</p>
        <h1 className="image-upload__title">Bring in an image.</h1>
        <p className="image-upload__description">
          Compress any image to WebP, JPEG, or PNG entirely in the browser.
          No upload, no server — your file never leaves your device.
        </p>
      </div>

      <div className="image-upload__actions">
        <label className="image-upload__picker" htmlFor="image-input">
          {selectedFile ? "Choose another image" : "Select image"}
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          className="image-upload__input"
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={onFileSelect}
        />

        <div className="image-upload__compress-group" ref={formatMenuRef}>
          <button
            type="button"
            className="image-upload__compress image-upload__compress--main"
            disabled={!selectedFile || isCompressing || selectedFormats.length === 0}
            onClick={() => {
              compressSelectedImage({ outputFormats: selectedFormats }).catch(() => undefined);
            }}
          >
            {isCompressing ? "Compressing..." : "Compress image"}
          </button>
          <button
            type="button"
            className="image-upload__compress image-upload__compress--toggle"
            aria-label="Choose output formats"
            aria-expanded={isFormatMenuOpen}
            aria-haspopup="true"
            disabled={isCompressing}
            onClick={() => setIsFormatMenuOpen((prev) => !prev)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{margin: "auto", transform: isFormatMenuOpen ? "rotate(180deg)" : undefined, transition: "transform 0.18s ease" }}
            >
              <polyline points="2 5 7 10 12 5" />
            </svg>
          </button>

          {isFormatMenuOpen && (
            <fieldset className="image-upload__format-menu">
              <legend className="image-upload__format-legend">Output formats</legend>
              {FORMAT_OPTIONS.map(({ value, label }) => (
                <div key={value} className="image-upload__format-item">
                  <label className="image-upload__format-option">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(value)}
                      onChange={() => toggleFormat(value)}
                    />
                    {label}
                  </label>
                </div>
              ))}
            </fieldset>
          )}
        </div>

        {selectedFile && (
          <button
            type="button"
            className="image-upload__clear"
            onClick={clearSelection}
          >
            Clear selection
          </button>
        )}

        {availableFormats.map((fmt) => (
          <button
            key={fmt}
            type="button"
            className="image-upload__download"
            onClick={() => {
              downloadFile(fmt);
            }}
          >
            Download {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      {isCompressing && (
        <div className="image-upload__progress-wrap">
          <div className="image-upload__progress-track">
            <div
              className="image-upload__progress-fill"
              style={{ width: `${compressionProgress}%` }}
            />
          </div>
          <span className="image-upload__progress-label">
            {compressionProgress}%
          </span>
        </div>
      )}

      <div className="image-upload__grid">
        <div>
          <ul className="image-upload__meta">
            <li className="image-upload__meta-card">
              <span className="image-upload__meta-label">File</span>
              <strong className="image-upload__meta-value">
                {selectedFile?.name ?? "No file selected"}
              </strong>
            </li>
            <li className="image-upload__meta-card">
              <span className="image-upload__meta-label">Size</span>
              <strong className="image-upload__meta-value">
                {selectedFile
                  ? formatFileSize(selectedFile.size)
                  : "Awaiting upload"}
              </strong>
            </li>
            <li className="image-upload__meta-card">
              <span className="image-upload__meta-label">Compressed output</span>
              {compressedFiles ? (
                <ul className="image-upload__output-list">
                  {availableFormats.map((fmt) => (
                    <li key={fmt}>
                      <strong>{fmt.toUpperCase()}</strong>
                      <span className="image-upload__meta-subvalue">
                        {formatFileSize((compressedFiles as Record<string, File>)[fmt].size)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <strong className="image-upload__meta-value">
                    Run compression to generate output
                  </strong>
                  <span className="image-upload__meta-subvalue">
                    {selectedFormats.length === 0
                      ? "Select at least one format"
                      : `Produces ${selectedFormats.map((f) => f.toUpperCase()).join(", ")}`}
                  </span>
                </>
              )}
            </li>
          </ul>
          <p className="image-upload__hint">
            Accepted format: any browser-supported image file available on the
            local device.
          </p>
          <p className="image-upload__feedback" aria-live="polite">
            {compressionFeedback}
          </p>
        </div>

        {previewUrl && (
          <div className="image-upload__preview">
            <img
              src={previewUrl}
              alt="Preview of the selected file"
              className="image-upload__preview-img"
            />
          </div>
        )}
      </div>
    </section>
  );
}
