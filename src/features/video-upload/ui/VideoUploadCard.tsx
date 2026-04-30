import { formatDuration, formatFileSize } from '../../../shared/lib/video'
import { useVideoUpload } from '../model/useVideoUpload'
import './VideoUploadCard.css'

export function VideoUploadCard() {
  const {
    selectedFile,
    previewUrl,
    durationInSeconds,
    compressedFile,
    isCompressing,
    compressionError,
    onFileSelect,
    onPreviewLoaded,
    compressSelectedVideo,
    clearSelection,
  } = useVideoUpload()

  const durationLabel = durationInSeconds === null ? 'Pending' : formatDuration(durationInSeconds)

  let compressionFeedback =
    'The compress button is wired to a dedicated feature function that you can customize later.'

  if (compressionError) {
    compressionFeedback = compressionError
  } else if (compressedFile) {
    compressionFeedback =
      'Compression completed. You can now replace the placeholder function with your own implementation.'
  }

  return (
    <section className="video-upload surface-panel">
      <div className="video-upload__header">
        <p className="video-upload__eyebrow">Routing-ready feature</p>
        <h1 className="video-upload__title">Bring in a video file.</h1>
        <p className="video-upload__description">
          This page is now isolated as a route, while the upload state and preview behavior
          live inside the feature layer.
        </p>
      </div>

      <div className="video-upload__actions">
        <label className="video-upload__picker" htmlFor="video-input">
          {selectedFile ? 'Choose another video' : 'Select video'}
        </label>
        <input
          id="video-input"
          type="file"
          accept="video/*"
          className="video-upload__input"
          onClick={(event) => {
            event.currentTarget.value = ''
          }}
          onChange={onFileSelect}
        />

        <button
          type="button"
          className="video-upload__compress"
          disabled={!selectedFile || isCompressing}
          onClick={() => {
            void compressSelectedVideo()
          }}
        >
          {isCompressing ? 'Compressing...' : 'Compress video'}
        </button>

        {selectedFile && (
          <button type="button" className="video-upload__clear" onClick={clearSelection}>
            Clear selection
          </button>
        )}
      </div>

      <div className="video-upload__grid">
        <div>
          <ul className="video-upload__meta">
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">File</span>
              <strong className="video-upload__meta-value">
                {selectedFile?.name ?? 'No file selected'}
              </strong>
            </li>
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">Size</span>
              <strong className="video-upload__meta-value">
                {selectedFile ? formatFileSize(selectedFile.size) : 'Awaiting upload'}
              </strong>
            </li>
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">Duration</span>
              <strong className="video-upload__meta-value">{durationLabel}</strong>
            </li>
            <li className="video-upload__meta-card">
              <span className="video-upload__meta-label">Compressed output</span>
              <strong className="video-upload__meta-value">
                {compressedFile?.name ?? 'Run compression to generate output'}
              </strong>
              <span className="video-upload__meta-subvalue">
                {compressedFile
                  ? formatFileSize(compressedFile.size)
                  : 'This currently uses a placeholder function.'}
              </span>
            </li>
          </ul>
          <p className="video-upload__hint">
            Accepted format: any browser-supported video file available on the local device.
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
                onPreviewLoaded(event.currentTarget.duration)
              }}
            >
              <track kind="captions" label="Captions unavailable" />
            </video>
          </div>
        ) : (
          <div className="video-upload__empty">
            <div>
              <h2 className="video-upload__empty-title">Preview will appear here</h2>
              <p className="video-upload__empty-copy">
                Pick a video above to inspect it before compression or processing.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
