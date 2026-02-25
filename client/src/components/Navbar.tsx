import { NavLink } from 'react-router-dom';
import * as s from './Navbar.styles';

export function Navbar() {
    return (
        <nav className={s.nav}>
            <div className={s.brand}>Kassa</div>
            <div className={s.navLinks}>
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? s.navLinkActive : s.navLink)}
                    end
                >
                    Search
                </NavLink>
                <NavLink
                    to="/admin"
                    className={({ isActive }) => (isActive ? s.navLinkActive : s.navLink)}
                >
                    Admin
                </NavLink>
            </div>
        </nav>
    );
}
