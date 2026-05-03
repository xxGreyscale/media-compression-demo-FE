import { formatDuration, formatFileSize } from "../../../shared/lib/video";
import { useVideoUpload } from "../model/useVideoUpload";
import "./VideoUploadCard.css";

export function VideoUploadCard() {
  const {
    selectedFile,
    previewUrl,
    durationInSeconds,
    compressedFiles,
    isCompressing,
    compressionProgress,
    compressionError,
    thumbnail,
    thumbnailUrl,
    isExtractingThumbnail,
    onFileSelect,
    onPreviewLoaded,
    compressSelectedVideo,
    downloadFile,
    downloadThumbnail,
    clearSelection,
  } = useVideoUpload();

  const durationLabel =
    durationInSeconds === null ? "Pending" : formatDuration(durationInSeconds);

  let compressionFeedback =
    "Select a video and hit Compress to produce MP4 and WebM outputs.";

  if (compressionError) {
    compressionFeedback = compressionError;
  } else if (compressedFiles) {
    compressionFeedback = "Compression complete — download either format below.";
  } else if (isCompressing) {
    compressionFeedback = "Encoding in progress…";
  }

  return (
    <section className="video-upload surface-panel">
      <div className="video-upload__header">
        <p className="video-upload__eyebrow">Routing-ready feature</p>
        <h1 className="video-upload__title">Bring in a video file.</h1>
        <p className="video-upload__description">
          This page is now isolated as a route, while the upload state and
          preview behavior live inside the feature layer.
        </p>
      </div>

      <div className="video-upload__actions">
        <label className="video-upload__picker" htmlFor="video-input">
          {selectedFile ? "Choose another video" : "Select video"}
        </label>
        <input
          id="video-input"
          type="file"
          accept="video/*"
          className="video-upload__input"
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={onFileSelect}
        />

        <button
          type="button"
          className="video-upload__compress"
          disabled={!selectedFile || isCompressing}
          onClick={() => {
            void compressSelectedVideo();
          }}
        >
          {isCompressing ? "Compressing..." : "Compress video"}
        </button>

        {selectedFile && (
          <button
            type="button"
            className="video-upload__clear"
            onClick={clearSelection}
          >
            Clear selection
          </button>
        )}

        {compressedFiles && (
          <>
            <button
              type="button"
              className="video-upload__download"
              onClick={() => {
                downloadFile("mp4");
              }}
            >
              Download MP4
            </button>
            {compressedFiles["webm"] && (
              <button
                type="button"
                className="video-upload__download"
                onClick={() => {
                  downloadFile("webm");
                }}
              >
                Download WebM
              </button>
            )}
          </>
        )}
      </div>

      {isCompressing && (
        <div className="video-upload__progress-wrap">
          <div className="video-upload__progress-track">
            <div
              className="video-upload__progress-fill"
              style={{ width: `${compressionProgress}%` }}
            />
          </div>
          <span className="video-upload__progress-label">
            {compressionProgress}%
          </span>
        </div>
      )}

      <div className="video-upload__grid">
        <div>
          <ul className="video-upload__meta">
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">File</span>
              <strong className="video-upload__meta-value">
                {selectedFile?.name ?? "No file selected"}
              </strong>
            </li>
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">Size</span>
              <strong className="video-upload__meta-value">
                {selectedFile
                  ? formatFileSize(selectedFile.size)
                  : "Awaiting upload"}
              </strong>
            </li>
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">Duration</span>
              <strong className="video-upload__meta-value">
                {durationLabel}
              </strong>
            </li>
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">
                Compressed output
              </span>
              {compressedFiles ? (
                <ul className="video-upload__output-list">
                  {Object.entries(compressedFiles).map(([fmt, file]) => (
                    <li key={fmt}>
                      <strong>{fmt.toUpperCase()}</strong>
                      <span className="video-upload__meta-subvalue">
                        {formatFileSize(file.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <strong className="video-upload__meta-value">
                    Run compression to generate output
                  </strong>
                  <span className="video-upload__meta-subvalue">
                    Produces MP4 (H.264) and WebM (VP9)
                  </span>
                </>
              )}
            </li>
          </ul>
          <p className="video-upload__hint">
            Accepted format: any browser-supported video file available on the
            local device.
          </p>
          <p className="video-upload__feedback" aria-live="polite">
            {compressionFeedback}
          </p>
        </div>

        {previewUrl ? (
          <div className="video-upload__preview">
            <video
              src={previewUrl}
              controls
              className="video-upload__player"
              onLoadedMetadata={(event) => {
                onPreviewLoaded(event.currentTarget.duration);
              }}
            >
              <track kind="captions" label="Captions unavailable" />
            </video>

            {(isExtractingThumbnail || thumbnailUrl) && (
              <div className="video-upload__thumbnail-strip">
                <div className="video-upload__thumbnail-frame">
                  {thumbnailUrl ? (
                    <>
                      <img
                        src={thumbnailUrl}
                        alt="Best frame thumbnail"
                        className="video-upload__thumbnail"
                      />
                      <div className="video-upload__thumbnail-overlay">
                        <button
                          type="button"
                          className="video-upload__thumb-action"
                          title="Download thumbnail"
                          onClick={downloadThumbnail}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 4v12M8 12l4 4 4-4" />
                            <path d="M4 20h16" />
                          </svg>
                        </button>
                        <a
                          href={thumbnailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-upload__thumb-action"
                          title="View full size"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="video-upload__thumbnail-skeleton" />
                  )}
                </div>
                <div className="video-upload__thumbnail-meta">
                  <span className="video-upload__thumbnail-eyebrow">
                    Best frame
                  </span>
                  <strong className="video-upload__thumbnail-time">
                    {isExtractingThumbnail
                      ? "Analysing…"
                      : `${thumbnail!.timestampSeconds.toFixed(2)}s`}
                  </strong>
                  <p className="video-upload__thumbnail-desc">
                    Selected by sharpness, contrast&nbsp;&amp; brightness
                    scoring
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="video-upload__empty">
            <div>
              <h2 className="video-upload__empty-title">
                Preview will appear here
              </h2>
              <p className="video-upload__empty-copy">
                Pick a video above to inspect it before compression or
                processing.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
