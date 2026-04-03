import React from 'react';

/**
 * Result Card Component
 * Generic reusable card for displaying search results
 * @param {string} title - Card title
 * @param {React.ReactNode} children - Card content
 */
function ResultCard({ title, children }) {
  /**
   * Get icon based on card title
   * @param {string} title - Card title
   * @returns {string} Emoji icon
   */
  const getIcon = (title) => {
    if (title?.toLowerCase().includes('user')) return '👤';
    if (title?.toLowerCase().includes('drive')) return '📁';
    if (title?.toLowerCase().includes('group')) return '👥';
    if (title?.toLowerCase().includes('member')) return '🧑‍🤝‍🧑';
    if (title?.toLowerCase().includes('detail')) return 'ℹ️';
    return '📊';
  };

  /**
   * Get description based on card title
   * @param {string} title - Card title
   * @returns {string} Description text
   */
  const getDescription = (title) => {
    if (title?.toLowerCase().includes('user')) {
      return 'User account information and details';
    }
    if (title?.toLowerCase().includes('drive')) {
      return 'Shared drive information and permissions';
    }
    if (title?.toLowerCase().includes('group')) {
      return 'Group membership and settings';
    }
    if (title?.toLowerCase().includes('member')) {
      return 'List of all members';
    }
    return 'Search results will appear here';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <span className="card-icon">{getIcon(title)}</span>
          {title}
        </h2>
        <p className="card-description">{getDescription(title)}</p>
      </div>
      <div className="card-body">
        {children || (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No results yet. Try searching above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultCard;