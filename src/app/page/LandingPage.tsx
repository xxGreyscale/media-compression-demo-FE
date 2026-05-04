import { Link } from "react-router-dom";
import { appPaths } from "../router/paths";
import "./LandingPage.css";

export function LandingPage() {
  return (
    <div className="landing">
      <section className="landing__hero surface-panel">
        <p className="landing__eyebrow">@your-org / media-util-sdk</p>
        <h1 className="landing__title">
          Compress media,<br />right here.
        </h1>
        <p className="landing__lead">
          A browser-native SDK that compresses images and videos entirely on
          device — no server, no upload, no waiting. Built on WebAssembly and
          the Canvas API.
        </p>
        <div className="landing__ctas">
          <Link to={appPaths.image} className="landing__cta landing__cta--primary">
            Try image compression
          </Link>
          <Link to={appPaths.video} className="landing__cta landing__cta--secondary">
            Try video compression
          </Link>
        </div>
      </section>

      <section className="landing__how">
        <h2 className="landing__section-title">How it works</h2>
        <ol className="landing__steps">
          <li className="landing__step surface-panel">
            <span className="landing__step-number">01</span>
            <div>
              <h3 className="landing__step-heading">Pick a file</h3>
              <p className="landing__step-body">
                Select any image or video from your device. The file is loaded
                directly into the browser — it never leaves your machine.
              </p>
            </div>
          </li>
          <li className="landing__step surface-panel">
            <span className="landing__step-number">02</span>
            <div>
              <h3 className="landing__step-heading">Compress in the browser</h3>
              <p className="landing__step-body">
                Images are processed by the Canvas API. Videos run through
                FFmpeg compiled to WebAssembly. Both happen entirely client-side
                at native speed.
              </p>
            </div>
          </li>
          <li className="landing__step surface-panel">
            <span className="landing__step-number">03</span>
            <div>
              <h3 className="landing__step-heading">Download modern formats</h3>
              <p className="landing__step-body">
                Get your output in the most efficient formats — WebP, JPEG, or
                PNG for images; MP4 (H.264) and WebM (VP9) for video.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="landing__try">
        <h2 className="landing__section-title">Try it</h2>
        <div className="landing__cards">
          <div className="landing__card surface-panel">
            <div className="landing__card-icon landing__card-icon--image" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h3 className="landing__card-title">Image compression</h3>
            <p className="landing__card-body">
              Compress any photo or graphic to a fraction of its size.
              Preserves visual quality while slashing file weight.
            </p>
            <ul className="landing__badges">
              <li className="landing__badge">WebP</li>
              <li className="landing__badge">JPEG</li>
              <li className="landing__badge">PNG</li>
            </ul>
            <Link to={appPaths.image} className="landing__card-link">
              Open image tool →
            </Link>
          </div>

          <div className="landing__card surface-panel">
            <div className="landing__card-icon landing__card-icon--video" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            </div>
            <h3 className="landing__card-title">Video compression</h3>
            <p className="landing__card-body">
              Re-encode any video using FFmpeg in WebAssembly. Outputs both
              MP4 and WebM in a single pass, plus a smart thumbnail.
            </p>
            <ul className="landing__badges">
              <li className="landing__badge">MP4 · H.264</li>
              <li className="landing__badge">WebM · VP9</li>
            </ul>
            <Link to={appPaths.video} className="landing__card-link">
              Open video tool →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
