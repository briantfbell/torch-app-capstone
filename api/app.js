const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
// configures allowed CORS URLs
const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(express.json());
app.use(cookieParser(process.env.JWT));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// commented sections are TO DO

// const authRoutes = require('./routes/authRoutes');
// const sectionsRoutes = require('./routes/sectionsRoutes');
// const endItemsRoutes = require('./routes/end-itemsRoutes');
// const inventoryRecordsRoutes = require('./routes/inventoryRecordsRoutes');
// const shortagesRoutes = require('./routes/shortagesRoutes');

// app.use('/auth', authRoutes);
// app.use('/sections', sectionsRoutes);
// app.use('/end-items', endItemsRoutes);
// app.use('/inventory-records', inventoryRecordsRoutes);
// app.use('/shortages', shortagesRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working for now...' });
});

module.exports = app;
