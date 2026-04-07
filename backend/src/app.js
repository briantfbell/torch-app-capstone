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

// Parse incoming JSON request bodies (required for POST/PATCH endpoints)
app.use(express.json());

// Parse cookies and sign them with the JWT secret so the auth middleware
// can read the httpOnly 'token' cookie set at login
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

// Route modules — each file handles a specific resource
const authRoutes = require('./api/routes/authRoutes'); // /auth
const usersRoutes = require('./api/routes/usersRoutes'); // /users
const uicRoutes = require('./api/routes/uicRoutes'); // /uic
const serialItemsRoutes = require('./api/routes/serialItemsRoutes'); // /serial-items
const componentsRoutes = require('./api/routes/componentsRoutes'); // /components
const endItemsRoutes = require('./api/routes/endItemsRoutes'); // /end-items

// Commented out: routes not yet active — controllers/services exist but are
// pending integration
// const inventoryRecordsRoutes = require('./routes/inventoryRecordsRoutes');
// const sectionsRoutes = require('./routes/sectionsRoutes');
// const shortagesRoutes = require('./routes/shortagesRoutes');

// Mount routers — all routes below require a valid JWT cookie unless noted
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/serial-items', serialItemsRoutes);
app.use('/components', componentsRoutes);
app.use('/end-items', endItemsRoutes);
app.use('/uic', uicRoutes);
// app.use('/inventory-records', inventoryRecordsRoutes);
// app.use('/sections', sectionsRoutes);
// app.use('/shortages', shortagesRoutes);

// Health check — useful for load balancers and CI smoke tests
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working for now...' });
});

module.exports = app;
