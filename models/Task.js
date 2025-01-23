const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
  content: { type: String, required: true },
  hashtag: { type: String, default: ''},
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Task', TaskSchema);
