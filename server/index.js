const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

const allowedOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.listen(PORT, () => {
  console.log(`🚀 WHENEVER Atelier Server listening on port ${PORT}`);
});

// middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  cors(
    allowedOrigins.length
      ? {
          origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
              return;
            }
            callback(new Error('Origin not allowed by CORS'));
          },
        }
      : {}
  )
);

// test endpoint
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from WHENEVER Atelier Server!' });
});

// apis
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));
