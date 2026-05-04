import type { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { appPaths } from '../router/paths'

export function AppShell({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand-block">
          <p className="app-header__eyebrow">@your-org</p>
          <Link to={appPaths.home} className="app-header__brand">
            media-util-sdk
          </Link>
        </div>

        <nav className="app-nav" aria-label="Primary">
          <NavLink
            to={appPaths.image}
            className={({ isActive }) =>
              isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
            }
          >
            Image
          </NavLink>
          <NavLink
            to={appPaths.video}
            className={({ isActive }) =>
              isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
            }
          >
            Video
          </NavLink>
        </nav>
      </header>

      <main className="app-main">{children}</main>
    </div>
  )
}
