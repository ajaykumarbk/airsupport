import React, { useState } from 'react';
import { fetchGroup } from '../api';
import ResultCard from '../components/ResultCard';

/**
 * Group Lookup Page
 * Search and display Google Workspace group information
 */
function GroupLookup() {
  const [groupEmail, setGroupEmail] = useState('');
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
      const result = await fetchGroup(groupEmail);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGroupInfo = () => {
    if (!data || !data.group) return null;

    const { group, members = [] } = data;

    return (
      <ResultCard title={`Group — ${group?.email || group?.name}`}>
        <p>
          <strong>Name:</strong> {group?.name}
        </p>
        <p>
          <strong>Email:</strong> {group?.email}
        </p>
        <p>
          <strong>Members Count:</strong> {members.length}
        </p>

        <h3>Members</h3>
        <table className="members-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr key={`${member.email}-${index}`}>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
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
          <label htmlFor="group-email-input">Enter Group Email</label>
          <div className="row">
            <input
              id="group-email-input"
              type="email"
              value={groupEmail}
              onChange={(e) => setGroupEmail(e.target.value)}
              placeholder="group@domain.com"
              disabled={isLoading}
            />
            <button type="submit" disabled={!groupEmail || isLoading} aria-busy={isLoading}>
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
            <h1 className="welcome-title">👥 Group Lookup</h1>
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
          {renderGroupInfo()}
        </div>
      )}
    </div>
  );
}

export default GroupLookup;