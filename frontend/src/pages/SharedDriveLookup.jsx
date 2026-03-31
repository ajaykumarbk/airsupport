import React, { useState } from 'react'
import { fetchDrive } from '../api'
import ResultCard from '../components/ResultCard'

export default function SharedDriveLookup() {
  const [driveId, setDriveId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSearch(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setData(null)
    try {
      const res = await fetchDrive(driveId)
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
          <label>Enter Shared Drive ID</label>
          <div className="row">
            <input
              value={driveId}
              onChange={(e) => setDriveId(e.target.value)}
              placeholder="0AExampleDriveID"
            />
            <button disabled={!driveId || loading}>
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>
      </div>

      {!data && !error && !loading && (
        <div className="welcome-center">
          <div className="welcome-card">
            <h1 className="welcome-title">📁 Shared Drive Lookup</h1>
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
          <ResultCard title={`Shared Drive — ${data.drive?.name || data.drive?.id}`}>
            <p><strong>ID:</strong> {data.drive?.id}</p>
            <p><strong>Name:</strong> {data.drive?.name}</p>
            <p><strong>Members count:</strong> {data.members?.length || 0}</p>

            <h3>Members</h3>
            <table className="members-table">
              <thead>
                <tr><th>Type</th><th>Email/Name</th><th>Role</th></tr>
              </thead>
              <tbody>
                {(data.members || []).map((m, i) => (
                  <tr key={i}>
                    <td>{m.type}</td>
                    <td>{m.emailAddress || m.displayName || m.id}</td>
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