const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SECRET } = require('./config');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes').router;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Obsługuje statyczne pliki frontendowe

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Loguj błędy MongoDB
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Trasy API
app.use('/api/tasks', taskRoutes); // Trasy dla zadań
app.use('/api/users', userRoutes); // Trasy dla użytkowników


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start serwera
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
