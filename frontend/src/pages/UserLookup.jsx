import React, { useState } from 'react'
import { fetchUser } from '../api'
import ResultCard from '../components/ResultCard'

export default function UserLookup() {
  const [email, setEmail] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSearch(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setData(null)
    try {
      const res = await fetchUser(email)
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <div className="search-section">
        <form onSubmit={onSearch} className="search-form-top">
          <label>Enter User Email</label>
          <div className="row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
            />
            <button disabled={!email || loading}>
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>
      </div>

      {!data && !error && !loading && (
        <div className="welcome-center">
          <div className="welcome-card">
            <h1 className="welcome-title">✨ Welcome to User Lookup</h1>
            <p className="welcome-subtitle">Search and manage your Google Workspace resources effortlessly</p>
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

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="results-section">
          <ResultCard title={`User — ${data.user.primaryEmail}`}>
            <dl>
              <dt>Full name</dt><dd>{data.user.name?.fullName}</dd>
              <dt>Given name</dt><dd>{data.user.name?.givenName}</dd>
              <dt>Family name</dt><dd>{data.user.name?.familyName}</dd>
              <dt>Primary email</dt><dd>{data.user.primaryEmail}</dd>
              <dt>Suspended</dt><dd>{data.user.suspended ? 'Yes' : 'No'}</dd>
              <dt>Admin</dt><dd>{data.user.isAdmin ? 'Yes' : 'No'}</dd>
              <dt>Aliases</dt><dd>{(data.aliases || []).map(a => a.alias).join(', ') || '—'}</dd>
              <dt>Org Unit Path</dt><dd>{data.user.orgUnitPath}</dd>
              <dt>Last login</dt><dd>{data.user.lastLoginTime || '—'}</dd>
            </dl>
          </ResultCard>
        </div>
      )}
    </div>
  )
}