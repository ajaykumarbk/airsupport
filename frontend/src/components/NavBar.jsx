import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar(){
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <>
      <button 
        className="sidebar-toggle" 
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle Sidebar"
      >
        {collapsed ? '☰' : '✕'}
      </button>
      
      <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <h1 className="logo">🚀 GW Support</h1>
            {!collapsed && <p className="tagline">Google Workspace Assistant</p>}
          </div>
        </div>

        <div className="sidebar-links">
          <Link className={loc.pathname === '/' ? 'active' : ''} to="/">
            <span className="link-icon">👤</span>
            {!collapsed && <span className="link-text">User Lookup</span>}
          </Link>
          <Link className={loc.pathname === '/drive' ? 'active' : ''} to="/drive">
            <span className="link-icon">📁</span>
            {!collapsed && <span className="link-text">Shared Drive</span>}
          </Link>
          <Link className={loc.pathname === '/group' ? 'active' : ''} to="/group">
            <span className="link-icon">👥</span>
            {!collapsed && <span className="link-text">Group Lookup</span>}
          </Link>
        </div>

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-info">
              <div className="info-item">
                <span>🔐</span>
                <span>Secure Access</span>
              </div>
              <div className="info-item">
                <span>⚡</span>
                <span>Fast Search</span>
              </div>
              <div className="info-item">
                <span>📊</span>
                <span>Detailed Reports</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}