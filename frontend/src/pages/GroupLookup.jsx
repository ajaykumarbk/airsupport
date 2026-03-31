import React, { useState } from 'react'
import { fetchGroup } from '../api'
import ResultCard from '../components/ResultCard'

export default function GroupLookup() {
  const [groupEmail, setGroupEmail] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSearch(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setData(null)
    try {
      const res = await fetchGroup(groupEmail)
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
          <label>Enter Group Email</label>
          <div className="row">
            <input
              value={groupEmail}
              onChange={(e) => setGroupEmail(e.target.value)}
              placeholder="group@domain.com"
            />
            <button disabled={!groupEmail || loading}>
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>
      </div>

      {!data && !error && !loading && (
        <div className="welcome-center">
          <div className="welcome-card">
            <h1 className="welcome-title">👥 Group Lookup</h1>
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
          <ResultCard title={`Group — ${data.group?.email || data.group?.name}`}>
            <p><strong>Name:</strong> {data.group?.name}</p>
            <p><strong>Email:</strong> {data.group?.email}</p>
            <p><strong>Members count:</strong> {data.members?.length || 0}</p>

            <h3>Members</h3>
            <table className="members-table">
              <thead>
                <tr><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {(data.members || []).map((m, i) => (
                  <tr key={i}>
                    <td>{m.email}</td>
                    <td>{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResultCard>
        </div>
      )}
    </div>
  )
}