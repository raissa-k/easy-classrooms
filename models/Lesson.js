const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },
  resource: [{
	type: String,
  }],
  dateDue: {
	type: Date
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lesson", LessonSchema);
