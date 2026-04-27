
import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import List from './List';
import Form from './Form';
import Summary from './Summary';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const API = `${API_BASE_URL}/api/expenses`;

const CATEGORY_OPTIONS = [
  'Food', 'Transport', 'Bills', 'Shopping',
  'Entertainment', 'Health', 'Education', 'Other',
];

// Fetch helper: auto-retries up to `retries` times on network failure
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

function AppRoutes() {
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(async (cat = filterCategory) => {
    setLoading(true);
    setError('');
    try {
      const url = cat ? `${API}?category=${encodeURIComponent(cat)}` : API;
      const res = await fetchWithRetry(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setExpenses(data);
      const totals = {};
      data.forEach((exp) => {
        if (!totals[exp.category]) totals[exp.category] = 0;
        totals[exp.category] += Number(exp.amount);
      });
      setCategoryTotals(Object.entries(totals));
    } catch (e) {
      if (e.name === 'TypeError') {
        setError('Cannot reach the server. Please check that the backend is running.');
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  const fetchTotal = useCallback(async (cat = filterCategory) => {
    try {
      const url = cat
        ? `${API}/total?category=${encodeURIComponent(cat)}`
        : `${API}/total`;
      const res = await fetchWithRetry(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTotal(Number(data.total));
    } catch {
      setTotal(0);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchExpenses();
    fetchTotal();
  }, [fetchExpenses, fetchTotal]);

  const handleAddExpense = async (expense) => {
    try {
      const res = await fetchWithRetry(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!res.ok) return false;
      fetchExpenses();
      fetchTotal();
      return true;
    } catch {
      return false;
    }
  };

  const handleRetry = () => {
    fetchExpenses();
    fetchTotal();
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              <List
                expenses={expenses}
                total={total}
                categoryTotals={categoryTotals}
                loading={loading}
                error={error}
                onRetry={handleRetry}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                CATEGORY_OPTIONS={CATEGORY_OPTIONS}
              />
            }
          />
          <Route
            path="/new"
            element={
              <Form onAdd={handleAddExpense} CATEGORY_OPTIONS={CATEGORY_OPTIONS} />
            }
          />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
