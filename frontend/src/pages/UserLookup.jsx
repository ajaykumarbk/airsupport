import React, { useState } from 'react';
import { fetchUser } from '../api';
import ResultCard from '../components/ResultCard';

/**
 * User Lookup Page
 * Global search for Google Workspace user information and group memberships
 */
function UserLookup() {
  const [email, setEmail] = useState('');
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
      const result = await fetchUser(email);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserInfo = () => {
    if (!data || !data.user) return null;

    const { user, aliases = [], groups = [] } = data;

    return (
      <>
        <ResultCard title={`User — ${user.primaryEmail}`}>
          <dl>
            <dt>Full Name</dt>
            <dd>{user.name?.fullName || '—'}</dd>

            <dt>Given Name</dt>
            <dd>{user.name?.givenName || '—'}</dd>

            <dt>Family Name</dt>
            <dd>{user.name?.familyName || '—'}</dd>

            <dt>Primary Email</dt>
            <dd>{user.primaryEmail}</dd>

            <dt>Suspended</dt>
            <dd>{user.suspended ? 'Yes' : 'No'}</dd>

            <dt>Admin</dt>
            <dd>{user.isAdmin ? 'Yes' : 'No'}</dd>

            <dt>Aliases</dt>
            <dd>{aliases.length > 0 ? aliases.map((a) => a.alias).join(', ') : '—'}</dd>

            <dt>Organization Unit Path</dt>
            <dd>{user.orgUnitPath || '—'}</dd>

            <dt>Last Login</dt>
            <dd>{user.lastLoginTime || '—'}</dd>
          </dl>
        </ResultCard>

        {/* Groups Section */}
        {groups && groups.length > 0 && (
          <ResultCard title={`Group Memberships (${groups.length})`}>
            <div style={{ marginTop: '12px' }}>
              {groups.map((group) => (
                <div key={group.id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: '3px solid #1a73e8'
                }}>
                  <strong style={{ color: '#202124' }}>{group.name}</strong>
                  <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>
                    {group.email}
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>
        )}
      </>
    );
  };

  return (
    <div className="page-content">
      {/* Search Form */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form-top">
          <label htmlFor="email-input">Search User</label>
          <div className="row">
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              disabled={isLoading}
            />
            <button type="submit" disabled={!email || isLoading} aria-busy={isLoading}>
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
            <h1 className="welcome-title">Global User Search</h1>
            <p className="welcome-subtitle">
              Enter a user email to view their details and group memberships
            </p>
          </div>
        </div>
      )}

      {/* Results State */}
      {data && (
        <div className="results-section">
          {renderUserInfo()}
        </div>
      )}
    </div>
  );
}

export default UserLookup;