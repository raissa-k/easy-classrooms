const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
	classroom: {type: mongoose.Schema.ObjectId, ref: 'Classroom'},
	student: {type: mongoose.Schema.ObjectId, ref: 'User'},
	lessonCompletion: [{
		lesson: {type: mongoose.Schema.ObjectId, ref: 'Lesson'}, 
		complete: Boolean}]
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);