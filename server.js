const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./backend/database');
const membersRouter = require('./backend/routes/members');
const contributionsRouter = require('./backend/routes/contributions');
const pledgesRouter = require('./backend/routes/pledges');
const ceremoniesRouter = require('./backend/routes/ceremonies');
const reportsRouter = require('./backend/routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/members', membersRouter);
app.use('/api/contributions', contributionsRouter);
app.use('/api/pledges', pledgesRouter);
app.use('/api/ceremonies', ceremoniesRouter);
app.use('/api/reports', reportsRouter);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

