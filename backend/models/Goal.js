const mongoose = require('mongoose');
const { Schema } = mongoose;

// Milestone schema (embedded in goals)
const milestoneSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// Task schema (embedded in goals)
const taskSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  recurrence: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// Goal schema
const goalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  milestones: [milestoneSchema],
  tasks: [taskSchema]
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);