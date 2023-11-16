const express = require('express');
const app = express();
const metricsRoutes = require('./routes/metricsRoutes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const randomSecret = require('crypto').randomBytes(64).toString('hex');
app.use(
  session({
    secret: randomSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true, // Make the cookie accessible only via HTTP requests (recommended)
      path: '/', // Cookie is valid for all routes
      sameSite: 'None',
    },
  })
);

// get metrics from prometheus server
// required route: /metrics/metrics?promAddress=<prometheus address>
app.use('/metrics', metricsRoutes);

// serve index.html
app.use(express.static(path.join(__dirname, '../dist/')));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error: ' + err,
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  if (!res.headerSent) {
    return res.status(errorObj.status).json(errorObj.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
