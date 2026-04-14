const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const app = express();

// Frontend team: allowed origins for CORS.
// In development the Vite dev server runs on port 5173.
// Set CLIENT_URL in your .env to allow your production frontend origin.
const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(express.json());
app.use(cookieParser(process.env.JWT));

// CORS configuration — credentials: true is required so the browser sends
// the httpOnly cookie on cross-origin requests (e.g. Vite → Express)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const uicsRoutes = require('./routes/uicsRoutes');
const serialEndItemsRoutes = require('./routes/serialEndItemsRoutes');
const serialComponentsRoutes = require('./routes/serialComponentsRoutes');
const componentsRoutes = require('./routes/componentsRoutes');
const endItemsRoutes = require('./routes/endItemsRoutes');
const ingestRoutes = require('./routes/ingestRoutes');
const currentHistoryEndItemsRoutes = require('./routes/currentHistoryEndItemsRoutes');
const currentHistoryComponentsRoutes = require('./routes/currentHistoryComponentsRoutes');
const archivedHistoryEndItemsRoutes = require('./routes/archivedHistoryEndItemsRoutes');
const archivedHistoryComponentsRoutes = require('./routes/archivedHistoryComponentsRoutes');

app.use('/auth', authRoutes);
app.use('/uics', uicsRoutes);
app.use('/users', auth, usersRoutes);
app.use('/serial-items', auth, serialEndItemsRoutes);
app.use('/serial-components', auth, serialComponentsRoutes);
app.use('/components', auth, componentsRoutes);
app.use('/end-items', auth, endItemsRoutes);
app.use('/ingest', auth, ingestRoutes);
app.use('/current-history/end-items', auth, currentHistoryEndItemsRoutes);
app.use('/current-history/components', auth, currentHistoryComponentsRoutes);
app.use('/archived-history/end-items', auth, archivedHistoryEndItemsRoutes);
app.use('/archived-history/components', auth, archivedHistoryComponentsRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working for now...' });
});

module.exports = app;
