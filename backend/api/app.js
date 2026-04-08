const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
const serialItemsRoutes = require('./routes/serialItemsRoutes');
const componentsRoutes = require('./routes/componentsRoutes');
const endItemsRoutes = require('./routes/endItemsRoutes');
const ingestRoutes = require('./routes/ingestRoutes');
// const historyRoutes = require('./routes/historyRoutes');
// const inventoryRecordsRoutes = require('./routes/inventoryRecordsRoutes');
// const sectionsRoutes = require('./routes/sectionsRoutes');
// const shortagesRoutes = require('./routes/shortagesRoutes');

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/serial-items', serialItemsRoutes);
app.use('/components', componentsRoutes);
app.use('/end-items', endItemsRoutes);
app.use('/ingest', ingestRoutes);
app.use('/uics', uicsRoutes);
// app.use('/inventory-records', inventoryRecordsRoutes);
// app.use('/sections', sectionsRoutes);
// app.use('/shortages', shortagesRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working for now...' });
});

module.exports = app;
