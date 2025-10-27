# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 2: Open Your Browser
Navigate to `http://localhost:3000`

### Step 3: Start Using the System
- Click "Register a New Member" to add members
- Record contributions and pledges
- Track ceremonies
- Generate monthly reports

## 📁 Project Structure

```
maggy/
├── server.js              # Main server (Express + SQLite)
├── package.json           # Dependencies
├── backend/               # API layer
│   ├── database.js       # DB initialization
│   ├── models/           # Data models
│   └── routes/           # API endpoints
├── frontend/             # UI layer
│   ├── index.html        # Main page
│   ├── styles.css        # Styling
│   └── app.js            # Frontend logic
└── data/                 # Database (auto-created)
```

## 🔧 Available Commands

- `npm start` - Start the server
- `npm run dev` - Start in development mode with auto-restart (requires nodemon)

## 🌐 API Endpoints

- Members: `GET/POST /api/members`
- Contributions: `GET/POST /api/contributions`
- Pledges: `GET/POST /api/pledges`
- Ceremonies: `GET/POST /api/ceremonies`
- Reports: `GET /api/reports/monthly`

## 📝 Next Steps

1. Register your first member
2. Record some contributions
3. Add capital campaign pledges
4. Track ceremonies
5. Generate a monthly report

---

**Note**: The database file (`data/church.db`) is automatically created when you first start the server.

## 🛑 Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

