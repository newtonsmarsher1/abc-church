const sqlite3 = require('sqlite3');

let db;

function initDB() {
  if (!db) {
    db = new sqlite3.Database(':memory:');
    
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL,
        householdSize INTEGER DEFAULT 1,
        sponsor TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }
  return db;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  initDB();

  if (req.method === 'GET') {
    db.all('SELECT * FROM members ORDER BY fullName', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else if (req.method === 'POST') {
    const { fullName, email, householdSize, sponsor } = req.body;
    db.run(
      'INSERT INTO members (fullName, email, householdSize, sponsor) VALUES (?, ?, ?, ?)',
      [fullName, email, householdSize, sponsor],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, fullName, email, householdSize, sponsor });
      }
    );
  } else if (req.method === 'DELETE') {
    const id = req.query.id;
    db.run('DELETE FROM members WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Deleted successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

