const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your local DeepBlue database
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'DeepBlue',
  user: 'postgres',
  password: process.env.PG_PASSWORD || 'postgres', // Set via env or change here
});

// Test DB connection
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Connected to DeepBlue database'))
  .catch(err => console.error('❌ DB connection failed:', err.message));

// ─── USERS ────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.profile_image, u.created_at,
        (SELECT COUNT(*) FROM reports r WHERE r.user_id = u.id) AS report_count,
        (SELECT COUNT(*) FROM user_medical_data m WHERE m.user_id = u.id) AS medical_data_count,
        (SELECT COUNT(*) FROM user_profiles p WHERE p.user_id = u.id) AS profile_data_count
      FROM users u
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single user detail
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query('SELECT id, email, profile_image, created_at FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const [medical, profiles, reports] = await Promise.all([
      pool.query('SELECT id, question_id, question_text, answer_json, created_at FROM user_medical_data WHERE user_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT id, question_id, question_text, answer_json, created_at FROM user_profiles WHERE user_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT id, report_id, assessment_topic, urgency_level, report_data, created_at FROM reports WHERE user_id = $1 ORDER BY created_at DESC', [id]),
    ]);

    res.json({
      ...user.rows[0],
      medical_data: medical.rows,
      profiles: profiles.rows,
      reports: reports.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── REPORTS ──────────────────────────────────────────────
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.email AS user_email
      FROM reports r
      LEFT JOIN users u ON u.id = r.user_id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS ────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [users, medical, profiles, reports, urgency] = await Promise.all([
      pool.query('SELECT COUNT(*) AS count FROM users'),
      pool.query('SELECT COUNT(*) AS count FROM user_medical_data'),
      pool.query('SELECT COUNT(*) AS count FROM user_profiles'),
      pool.query('SELECT COUNT(*) AS count FROM reports'),
      pool.query(`SELECT urgency_level, COUNT(*) AS count FROM reports GROUP BY urgency_level ORDER BY count DESC`),
    ]);

    res.json({
      users: parseInt(users.rows[0].count),
      medical_records: parseInt(medical.rows[0].count),
      profile_entries: parseInt(profiles.rows[0].count),
      reports: parseInt(reports.rows[0].count),
      urgency_distribution: urgency.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET /api/users       — All users with counts`);
  console.log(`   GET /api/users/:id   — User detail with medical/profile/reports`);
  console.log(`   GET /api/reports     — All reports`);
  console.log(`   GET /api/stats       — Dashboard stats`);
});
