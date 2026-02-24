import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { AdminPage } from './pages/AdminPage';
import * as s from './App.styles';

s.initGlobalStyles();

function App() {
  return (
    <BrowserRouter>
      <div className={s.app}>
        <nav className={s.nav}>
          <div className={s.brand}>Kassa</div>
          <div className={s.navLinks}>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? s.navLinkActive : s.navLink}
              end
            >
              Search
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => isActive ? s.navLinkActive : s.navLink}
            >
              Admin
            </NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
