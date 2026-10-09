import { Link, NavLink, Outlet } from 'react-router'
import { CommandPalette } from '@/features/palette/CommandPalette.tsx'
import './RootLayout.css'

/**
 * Application shell: header telemetry bar + primary navigation + outlet.
 * Landmarks and heading order are deliberate for screen-reader users.
 */
export function RootLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/pokedex" className="brand" aria-label="Pokédex 2027 home">
            <span className="brand-mark" aria-hidden="true">
              ◈
            </span>
            <span className="brand-text">
              POKÉDEX <span className="brand-year">// 2027</span>
            </span>
          </NavLink>
          <nav aria-label="Primary" className="app-nav">
            <NavLink
              to="/pokedex"
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              Explorer
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              Compare
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              Favorites
            </NavLink>
            <NavLink to="/team" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
              Team
            </NavLink>
          </nav>
          <CommandPalette />
        </div>
      </header>
      <main id="main-content" className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          Pokédex // 2027 · Research archive prototype · Data by{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
            PokéAPI
          </a>{' '}
          · <Link to="/lab">Visual lab</Link>
        </p>
      </footer>
    </>
  )
}
