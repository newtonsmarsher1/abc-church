// API endpoint for Vercel
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// In-memory database for Vercel (serverless)
let db = null;

// Initialize in-memory database
function initDB() {
  if (!db) {
    db = new sqlite3.Database(':memory:');
    createTables(db);
  }
  return db;
}

function createTables(database) {
  database.serialize(() => {
    database.run(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL,
        householdSize INTEGER DEFAULT 1,
        sponsor TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (memberId) REFERENCES members(id)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS pledges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        monthly REAL NOT NULL,
        months INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (memberId) REFERENCES members(id)
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS ceremonies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (memberId) REFERENCES members(id)
      )
    `);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  initDB();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Handle root
  if (pathname === '/') {
    return res.status(200).json({ message: 'ABC Church API' });
  }

  // Handle 404
  res.status(404).json({ error: 'Not found' });
};

