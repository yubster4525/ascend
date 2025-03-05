const mongoose = require('mongoose');
const { Schema } = mongoose;

const habitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitName: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    default: 'daily'
  },
  logs: [
    {
      date: { type: Date, default: Date.now },
      status: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);