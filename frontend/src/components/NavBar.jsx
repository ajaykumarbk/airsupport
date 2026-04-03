import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation Bar Component
 * Sidebar navigation with collapsible state and user info
 */
function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/', icon: '👤', label: 'User Search' },
    { path: '/group', icon: '👥', label: 'Group Search' },
    { path: '/drive', icon: '📁', label: 'Drive Search' },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? '☰' : '✕'}
      </button>

      <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Logo/Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <h1 className="logo">GW Support</h1>
            {!isCollapsed && (
              <p className="tagline">Secure Access</p>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-links">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              to={item.path}
            >
              <span className="link-icon">{item.icon}</span>
              {!isCollapsed && (
                <span className="link-text">{item.label}</span>
              )}
            </Link>
          ))}
        </div>

        {/* User Info and Logout */}
        {user && (
          <div className="sidebar-footer">
            {!isCollapsed && (
              <div className="user-info">
                <p className="user-email">{user.email}</p>
                {user.firstName && (
                  <p className="user-name">{user.firstName} {user.lastName || ''}</p>
                )}
              </div>
            )}
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              {isCollapsed ? '🔒' : 'Logout'}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export default NavBar;