const { getDB } = require('../database');

class Pledge {
  static async getAll() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.all(`
        SELECT p.*, m.fullName as memberName 
        FROM pledges p 
        LEFT JOIN members m ON p.memberId = m.id 
        ORDER BY p.createdAt DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
        db.close();
      });
    });
  }

  static async getTotalPledged() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.get('SELECT SUM(monthly * months) as total FROM pledges', (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
        db.close();
      });
    });
  }

  static async create(pledge) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run(
        'INSERT INTO pledges (memberId, monthly, months) VALUES (?, ?, ?)',
        [pledge.memberId, pledge.monthly, pledge.months],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...pledge });
          db.close();
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run('DELETE FROM pledges WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
        db.close();
      });
    });
  }
}

module.exports = Pledge;

