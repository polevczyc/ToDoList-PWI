const express = require('express');
const Task = require('../models/Task'); 

const router = express.Router();
const { authenticate } = require('./userRoutes');


// Dodaj nowe zadanie
router.post('/', authenticate, async (req, res) => {
  console.log('Request body:', req.body); 
  console.log('User ID:', req.userId);   
  try {
    const task = new Task({
      content: req.body.content,
      hashtag: req.body.hashtag || '',  // Hashtag jest opcjonalny
      userId: req.userId, 
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


// Pobierz wszystkie zadania
router.get('/', authenticate, async (req, res) => {
  console.log("Fetching tasks for userId:", req.userId);
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 }); // Sortowanie od najnowszych
    console.log("Tasks found:", tasks);
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error); 
    res.status(500).send({ error: 'Error fetching tasks' });
  }
});

// Aktualizacja treści zadania (content i hashtag)
router.patch('/update/:id', authenticate, async (req, res) => {
  try {
    const { content, hashtag } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    task.content = content || task.content;  
    task.hashtag = hashtag || task.hashtag;  

    await task.save();
    res.status(200).send(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Oznacz zadanie jako ukończone/nieukończone
router.patch('/complete/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    task.completed = !task.completed;  // Zmiana statusu ukończenia
    await task.save();
    res.send(task);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Usuń zadanie

router.delete('/:id', authenticate, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).send({ error: 'Task not found' });

  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

module.exports = router;
