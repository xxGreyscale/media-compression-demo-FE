import { Link } from 'react-router-dom'
import { appPaths } from '../router/paths'

export function NotFoundPage() {
  return (
    <section className="surface-panel not-found">
      <p className="not-found__eyebrow">404</p>
      <h1 className="not-found__title">That page does not exist.</h1>
      <p className="not-found__copy">
        The route is set up, but there is nothing registered at this URL yet.
      </p>
      <Link to={appPaths.home} className="not-found__link">
        Go back to upload
      </Link>
    </section>
  )
}
