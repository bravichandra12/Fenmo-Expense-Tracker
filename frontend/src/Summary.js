import React, { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const API = `${API_BASE_URL}/api/expenses`;

const CATEGORY_COLORS = {
  Food:          '#6366f1',
  Transport:     '#f59e0b',
  Bills:         '#ef4444',
  Shopping:      '#10b981',
  Entertainment: '#8b5cf6',
  Health:        '#ec4899',
  Education:     '#3b82f6',
  Other:         '#6b7280',
};

async function fetchWithRetry(url, options = {}, retries = 2, delayMs = 800) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
}

function Summary() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [expRes, totRes] = await Promise.all([
        fetchWithRetry(API),
        fetchWithRetry(`${API}/total`),
      ]);
      if (!expRes.ok || !totRes.ok) throw new Error('Server returned an error');
      const expData = await expRes.json();
      const totData = await totRes.json();

      setExpenses(expData);
      setTotal(Number(totData.total) || 0);

      const totals = {};
      expData.forEach((exp) => {
        if (!totals[exp.category]) totals[exp.category] = 0;
        totals[exp.category] += Number(exp.amount);
      });
      setCategoryTotals(Object.entries(totals).sort((a, b) => b[1] - a[1]));
    } catch (e) {
      if (e.name === 'TypeError') {
        setError('Cannot reach the server. Please check that the backend is running.');
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const count = expenses.length;
  const avg = count > 0 ? total / count : 0;
  const topCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

  return (
    <div className="expense-page premium-bg">
      <div className="expense-shell premium-shell">
        <h1 className="expense-title premium-title">Summary</h1>

        {error && (
          <div className="error-banner">
            <span className="error-banner-msg">⚠️ {error}</span>
            <button className="retry-btn" onClick={fetchAll}>
              ↺ Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="summary-loading">Loading summary...</div>
        ) : !error && (
          <>
            {/* Stat cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-card-label">Total Spent</div>
                <div className="summary-card-value">₹{total.toFixed(2)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-label">Transactions</div>
                <div className="summary-card-value">{count}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-label">Avg per Expense</div>
                <div className="summary-card-value">₹{avg.toFixed(2)}</div>
              </div>
              {topCategory && (
                <div className="summary-card">
                  <div className="summary-card-label">Top Category</div>
                  <div
                    className="summary-card-value"
                    style={{ color: CATEGORY_COLORS[topCategory[0]] || '#6366f1' }}
                  >
                    {topCategory[0]}
                  </div>
                </div>
              )}
            </div>

            {/* Category breakdown */}
            <h2 className="summary-section-title">Spending by Category</h2>
            {categoryTotals.length === 0 ? (
              <div style={{ color: '#888', fontWeight: 400, marginTop: 8 }}>
                No expenses recorded yet.
              </div>
            ) : (
              <div className="summary-bars">
                {categoryTotals.map(([cat, amt]) => {
                  const pct = total > 0 ? (amt / total) * 100 : 0;
                  const color = CATEGORY_COLORS[cat] || '#6366f1';
                  return (
                    <div className="summary-bar-row" key={cat}>
                      <div className="summary-bar-meta">
                        <span className="summary-bar-dot" style={{ background: color }}></span>
                        <span className="summary-bar-name">{cat}</span>
                        <span className="summary-bar-amount">₹{amt.toFixed(2)}</span>
                        <span className="summary-bar-pct">({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="summary-bar-track">
                        <div
                          className="summary-bar-fill"
                          style={{ width: `${pct}%`, background: color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Summary;
