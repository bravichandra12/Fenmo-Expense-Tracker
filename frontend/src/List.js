import React, { useState } from 'react';

function List({ expenses, total, categoryTotals, loading, error, onRetry, filterCategory, setFilterCategory, CATEGORY_OPTIONS }) {
  const [sortOrder, setSortOrder] = useState('newest');

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.expense_date) - new Date(a.expense_date) || b.id - a.id;
    } else {
      return new Date(a.expense_date) - new Date(b.expense_date) || a.id - b.id;
    }
  });

  return (
    <div className="expense-page premium-bg">
      <div className="expense-shell premium-shell">
        <div className="expense-header">
          <h1 className="expense-title premium-title">Expense Tracker</h1>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 800 }}>
            Filter by category:
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="">All</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 800 }}>
            Sort by:
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        <div className="expense-total">Total: ₹{total.toFixed(2)}</div>

        {error && (
          <div className="error-banner">
            <span className="error-banner-msg">⚠️ {error}</span>
            {onRetry && (
              <button className="retry-btn" onClick={onRetry}>
                ↺ Retry
              </button>
            )}
          </div>
        )}
        {loading ? (
          <div style={{ fontWeight: 800, margin: '18px 0' }}>Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div style={{ fontWeight: 800, margin: '18px 0', color: '#888' }}>No expenses found.</div>
        ) : (
          <table className="expense-table premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount (₹)</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.expense_date}</td>
                    <td>₹{Number(exp.amount).toFixed(2)}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default List;
