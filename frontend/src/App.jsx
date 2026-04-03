import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserLookup from './pages/UserLookup';
import SharedDriveLookup from './pages/SharedDriveLookup';
import GroupLookup from './pages/GroupLookup';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main Application Component (with auth routing)
 * Routes and layout setup for the GW Dashboard
 */
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-root">
      {isAuthenticated && <NavBar />}
      <main className={isAuthenticated ? 'container' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserLookup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drive"
            element={
              <ProtectedRoute>
                <SharedDriveLookup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/group"
            element={
              <ProtectedRoute>
                <GroupLookup />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

