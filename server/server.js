// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
