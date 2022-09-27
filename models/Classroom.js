const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
	required: true
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  accessName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lessons: [{
	type: mongoose.Schema.Types.ObjectId,
	ref: "Lesson"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updated: Date
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
