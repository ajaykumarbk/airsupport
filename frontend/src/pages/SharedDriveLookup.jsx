import React, { useState } from 'react';
import { fetchDrive } from '../api';
import ResultCard from '../components/ResultCard';

/**
 * Shared Drive Lookup Page
 * Search and display Google Shared Drive information
 */
function SharedDriveLookup() {
  const [driveId, setDriveId] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Clear previous state
    setError(null);
    setData(null);
    setIsLoading(true);

    try {
      const result = await fetchDrive(driveId);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDriveInfo = () => {
    if (!data || !data.drive) return null;

    const { drive, members = [] } = data;

    return (
      <ResultCard title={`Shared Drive — ${drive?.name || drive?.id}`}>
        <p>
          <strong>ID:</strong> {drive?.id}
        </p>
        <p>
          <strong>Name:</strong> {drive?.name}
        </p>
        <p>
          <strong>Members Count:</strong> {members.length}
        </p>

        <h3>Members & Permissions</h3>
        <table className="members-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Email / Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr key={`${member.id}-${index}`}>
                  <td>{member.type}</td>
                  <td>{member.emailAddress || member.displayName || member.id}</td>
                  <td>{member.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResultCard>
    );
  };

  return (
    <div className="page-content">
      {/* Search Form */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form-top">
          <label htmlFor="drive-id-input">Enter Shared Drive ID</label>
          <div className="row">
            <input
              id="drive-id-input"
              type="text"
              value={driveId}
              onChange={(e) => setDriveId(e.target.value)}
              placeholder="0AExampleDriveID"
              disabled={isLoading}
            />
            <button type="submit" disabled={!driveId || isLoading} aria-busy={isLoading}>
              {isLoading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {/* Welcome State */}
      {!data && !error && !isLoading && (
        <div className="welcome-center">
          <div className="welcome-card">
            <h1 className="welcome-title">📁 Shared Drive Lookup</h1>
            <p className="welcome-subtitle">
              Search and manage your Google Workspace resources effortlessly
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <h3>Secure Access</h3>
                <p>Enterprise-grade security</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <h3>Fast Search</h3>
                <p>Lightning-fast results</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h3>Detailed Reports</h3>
                <p>Comprehensive insights</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results State */}
      {data && (
        <div className="results-section">
          {renderDriveInfo()}
        </div>
      )}
    </div>
  );
}

export default SharedDriveLookup;