// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get, set user data in db
app.use('/users', userRoutes);
// get metrics from prometheus server
app.use('/metrics', metricsRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
