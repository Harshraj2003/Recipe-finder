require('dotenv').config();
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes'); 
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Assuming you have this
connectDB();
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes); 

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold)
);