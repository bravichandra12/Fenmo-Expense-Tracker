import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ onAdd, CATEGORY_OPTIONS }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double clicks
    
    setError('');
    if (!amount || !category || !expenseDate) {
      setError('Amount, category, and date are required.');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    
    setIsSubmitting(true);
    const success = await onAdd({ amount, category, description, expense_date: expenseDate });
    setIsSubmitting(false);

    if (success) {
      setAmount('');
      setCategory('');
      setDescription('');
      setExpenseDate('');
      navigate('/');
    } else {
      setError('Failed to add expense');
    }
  };

  return (
    <div className="expense-page premium-bg">
      <div className="expense-shell premium-shell">
        <form className="expense-form premium-form" onSubmit={handleSubmit} style={{ flexDirection: 'column', gap: 18 }}>
          <label>Amount (₹)
            <input
              type="number"
              step="0.01"
              placeholder="Amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </label>
          <label>Category
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>Description
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <label>Date
            <input
              type="date"
              value={expenseDate}
              onChange={e => setExpenseDate(e.target.value)}
              required
            />
          </label>
          <button className="premium-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
          {error && <div className="expense-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Form;
