const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'church.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database and create tables if they don't exist
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Database connected');
      
      // Create tables
      db.serialize(() => {
        // Members table
        db.run(`
          CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT NOT NULL,
            householdSize INTEGER DEFAULT 1,
            sponsor TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Contributions table
        db.run(`
          CREATE TABLE IF NOT EXISTS contributions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memberId INTEGER NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (memberId) REFERENCES members(id)
          )
        `);

        // Pledges table
        db.run(`
          CREATE TABLE IF NOT EXISTS pledges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memberId INTEGER NOT NULL,
            monthly REAL NOT NULL,
            months INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (memberId) REFERENCES members(id)
          )
        `);

        // Ceremonies table
        db.run(`
          CREATE TABLE IF NOT EXISTS ceremonies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memberId INTEGER NOT NULL,
            type TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (memberId) REFERENCES members(id)
          )
        `);

        db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  });
}

// Get database connection
function getDB() {
  return new sqlite3.Database(DB_PATH);
}

module.exports = { initializeDatabase, getDB };

