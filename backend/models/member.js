const { getDB } = require('../database');

class Member {
  static async getAll() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.all('SELECT * FROM members ORDER BY fullName', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
        db.close();
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.get('SELECT * FROM members WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
        db.close();
      });
    });
  }

  static async create(member) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run(
        'INSERT INTO members (fullName, email, householdSize, sponsor) VALUES (?, ?, ?, ?)',
        [member.fullName, member.email, member.householdSize, member.sponsor],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...member });
          db.close();
        }
      );
    });
  }

  static async update(id, member) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run(
        'UPDATE members SET fullName = ?, email = ?, householdSize = ?, sponsor = ? WHERE id = ?',
        [member.fullName, member.email, member.householdSize, member.sponsor, id],
        function(err) {
          if (err) reject(err);
          else resolve({ id, ...member });
          db.close();
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run('DELETE FROM members WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
        db.close();
      });
    });
  }
}

module.exports = Member;

