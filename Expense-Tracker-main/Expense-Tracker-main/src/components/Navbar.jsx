import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = `
.navbar {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-logo {
  font-family: 'DM Serif Display', serif;
  font-size: 20px;
  letter-spacing: -0.5px;
  text-decoration: none;
  color: var(--text);
}
.navbar-logo em { font-style: italic; color: var(--green); }
.navbar-links { display: flex; gap: 4px; }
.nav-link {
  text-decoration: none;
  padding: 6px 14px;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  transition: all 0.15s;
}
.nav-link:hover, .nav-link.active {
  background: var(--bg);
  color: var(--text);
}
.nav-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--text);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  cursor: pointer; letter-spacing: 0.5px;
  transition: opacity 0.15s;
}
.nav-avatar:hover { opacity: 0.75; }
@media (max-width: 600px) {
  .navbar { padding: 0 1rem; }
  .nav-link { padding: 5px 8px; font-size: 12px; }
}
`;

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ME';

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-logo">
          Expense<em>ly</em>
        </Link>
        <div className="navbar-links">
          {[['Dashboard', '/dashboard'], ['Expenses', '/expenses'], ['Add New', '/add']].map(([label, path]) => (
            <Link key={path} to={path} className={`nav-link${pathname === path ? ' active' : ''}`}>
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-avatar" onClick={onLogout} title="Logout">
          {initials}
        </div>
      </nav>
    </>
  );
}