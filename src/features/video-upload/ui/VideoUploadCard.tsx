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
    onFileSelect,
    onPreviewLoaded,
    compressSelectedVideo,
    downloadFile,
    clearSelection,
  } = useVideoUpload();

  const durationLabel =
    durationInSeconds === null ? "Pending" : formatDuration(durationInSeconds);

  let compressionFeedback =
    "Select a video and hit Compress to produce MP4 and WebM outputs.";

  if (compressionError) {
    compressionFeedback = compressionError;
  } else if (compressedFiles) {
    compressionFeedback =
      "Compression complete — download either format below.";
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
            <button
              type="button"
              className="video-upload__download"
              onClick={() => {
                downloadFile("webm");
              }}
            >
              Download WebM
            </button>
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
                  <li>
                    <strong>MP4</strong>
                    <span className="video-upload__meta-subvalue">
                      {formatFileSize(compressedFiles.mp4.size)}
                    </span>
                  </li>
                  <li>
                    <strong>WebM</strong>
                    <span className="video-upload__meta-subvalue">
                      {formatFileSize(compressedFiles.webm.size)}
                    </span>
                  </li>
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
