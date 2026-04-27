import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Prevent idle connections from being silently dropped by Render/cloud DBs
  max: 10,
  idleTimeoutMillis: 30000,       // close idle clients after 30s
  connectionTimeoutMillis: 5000,  // fail fast if DB is unreachable (5s)
});

// Catch pool-level errors so the process never crashes on a dropped connection
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express backend is running');
});

// Health check — useful for uptime monitors / keeping Render awake
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'error', error: err.message });
  }
});

// Create a new expense
app.post('/api/expenses', async (req, res) => {
  const { amount, category, description, expense_date } = req.body;
  if (!amount || !category || !expense_date) {
    return res.status(400).json({ error: 'amount, category, and expense_date are required' });
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO expenses (amount, category, description, expense_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, category, description || '', expense_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/expenses error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get expenses with optional category filter
app.get('/api/expenses/total', async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT SUM(amount) AS total FROM expenses';
  const params = [];
  if (category) {
    params.push(category);
    query += ` WHERE category = $${params.length}`;
  }
  try {
    const result = await pool.query(query, params);
    res.json({ total: result.rows[0].total || 0 });
  } catch (err) {
    console.error('GET /api/expenses/total error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get expenses list (must come AFTER /total to avoid route shadowing)
app.get('/api/expenses', async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM expenses';
  const params = [];
  if (category) {
    params.push(category);
    query += ` WHERE category = $${params.length}`;
  }
  query += ' ORDER BY expense_date DESC, id DESC';
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/expenses error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
