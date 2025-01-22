const express = require('express');
const Task = require('../models/Task'); // Import modelu Task

const router = express.Router();
const { authenticate } = require('./userRoutes');


// Dodaj nowe zadanie
router.post('/', authenticate, async (req, res) => {
  console.log('Request body:', req.body); // Log danych wejściowych
  console.log('User ID:', req.userId);   // Log ID użytkownika z tokena
  try {
    const task = new Task({
      content: req.body.content,
      userId: req.userId, // Przypisz userId z middleware `authenticate`
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.error('Error saving task:', error); // Loguj błędy
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


// Pobierz wszystkie zadania
router.get('/', authenticate, async (req, res) => {
  console.log("Fetching tasks for userId:", req.userId); // Debug
  try {
    const tasks = await Task.find({ userId: req.userId });
    console.log("Tasks found:", tasks); // Debug
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error); // Debug
    res.status(500).send({ error: 'Error fetching tasks' });
  }
});

// Oznacz zadanie jako ukończone/nieukończone

router.patch('/:id', authenticate, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).send({ error: 'Task not found' });
  task.completed = !task.completed;
  await task.save();
  res.send(task);
});
// Usuń zadanie

router.delete('/:id', authenticate, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).send({ error: 'Task not found' });

  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

module.exports = router;
