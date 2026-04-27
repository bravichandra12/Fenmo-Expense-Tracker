import React from 'react';

function List({ expenses, total, categoryTotals, loading, error, onRetry, filterCategory, setFilterCategory, CATEGORY_OPTIONS }) {
  return (
    <div className="expense-page premium-bg">
      <div className="expense-shell premium-shell">
        <div className="expense-header">
          <h1 className="expense-title premium-title">Expense Tracker</h1>
        </div>
        <div style={{ marginBottom: 16 }}>
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
        </div>
        <div className="expense-total">Total: ₹{total.toFixed(2)}</div>
        {categoryTotals.length > 0 && (
          <table className="expense-table premium-table" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {categoryTotals.map(([cat, amt]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>₹{amt.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              {expenses
                .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date) || b.id - a.id)
                .map(exp => (
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
