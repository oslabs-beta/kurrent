// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

// process.env['NODE_NO_WARNINGS'] = 1; // Suppress all Node.js warnings

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

const randomSecret = require('crypto').randomBytes(64).toString('hex');
app.use(
  session({
    secret: randomSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Adjust to true in a production environment with HTTPS
      httpOnly: true, // Make the cookie accessible only via HTTP requests (recommended)
      path: '/', // Cookie is valid for all routes
    },
  })
);

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Include the new route to test session persistence
app.get('/test-session', (req, res) => {
  if (req.session.user && req.session.user.username) {
    console.log('Username:', req.session.user.username);
    res.json({ message: 'Session is active' });
  } else {
    res.json({ message: 'No active session found' });
  }
});


// get, set user data in db
app.use('/users', userRoutes);
// get metrics from prometheus server
app.use('/metrics', metricsRoutes);

app.use('/login', (req, res) => {
  return res.redirect('/')
})
app.use('/', (req, res) => {
  return res.sendFile(path.resolve(__dirname, '../client/index.html'))
})

// app.use('/', express.static(__dirname, '../client/index.'))



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


