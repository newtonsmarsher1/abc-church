const { getDB } = require('../database');

class Contribution {
  static async getAll() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.all(`
        SELECT c.*, m.fullName as memberName 
        FROM contributions c 
        LEFT JOIN members m ON c.memberId = m.id 
        ORDER BY c.date DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
        db.close();
      });
    });
  }

  static async getMonthlyTotal(month, year) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.get(
        `SELECT SUM(amount) as total FROM contributions 
         WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
        [month.toString().padStart(2, '0'), year.toString()],
        (err, row) => {
          if (err) reject(err);
          else resolve(row?.total || 0);
          db.close();
        }
      );
    });
  }

  static async create(contribution) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run(
        'INSERT INTO contributions (memberId, amount, type, date) VALUES (?, ?, ?, ?)',
        [contribution.memberId, contribution.amount, contribution.type, contribution.date],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...contribution });
          db.close();
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run('DELETE FROM contributions WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
        db.close();
      });
    });
  }
}

module.exports = Contribution;

