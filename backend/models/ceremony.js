const { getDB } = require('../database');

class Ceremony {
  static async getAll() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.all(`
        SELECT c.*, m.fullName as memberName 
        FROM ceremonies c 
        LEFT JOIN members m ON c.memberId = m.id 
        ORDER BY c.date DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
        db.close();
      });
    });
  }

  static async getByMonth(month, year) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.all(`
        SELECT c.*, m.fullName as memberName 
        FROM ceremonies c 
        LEFT JOIN members m ON c.memberId = m.id 
        WHERE strftime('%m', c.date) = ? AND strftime('%Y', c.date) = ?
        ORDER BY c.date DESC
      `,
      [month.toString().padStart(2, '0'), year.toString()],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
        db.close();
      });
    });
  }

  static async create(ceremony) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run(
        'INSERT INTO ceremonies (memberId, type, date) VALUES (?, ?, ?)',
        [ceremony.memberId, ceremony.type, ceremony.date],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...ceremony });
          db.close();
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run('DELETE FROM ceremonies WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
        db.close();
      });
    });
  }
}

module.exports = Ceremony;

