import type { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { appPaths } from '../router/paths'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand-block">
          <p className="app-header__eyebrow">Media workspace</p>
          <Link to={appPaths.home} className="app-header__brand">
            Video Intake
          </Link>
        </div>

        <nav className="app-nav" aria-label="Primary">
          <NavLink
            to={appPaths.home}
            end
            className={({ isActive }) =>
              isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
            }
          >
            Upload
          </NavLink>
        </nav>
      </header>

      <main className="app-main">{children}</main>
    </div>
  )
}
