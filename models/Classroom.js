const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
	type: String
  },
  image: {
    type: String,
	default: "https://placeimg.com/640/480/nature"
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  accessName: {
    type: String,
	unique: true
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
