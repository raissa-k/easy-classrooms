const { startSession } = require("mongoose");
const Lesson = require("../models/Lesson")
const Classroom = require("../models/Classroom")
const Comment = require("../models/Comment")
const User = require("../models/User")

module.exports = {
  createLesson: async (req, res) => {
	let classroomId = req.params.classroomId

	let classroom
	try {
		classroom = await Classroom.findOne({
			_id: classroomId,
			creator: req.user
		})
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}

	const createdLesson = new Lesson({
		title: req.body.title,
		description: req.body.description,
		resource: [],
		creator: req.user.id
	})

	if (req.body.resource) createdLesson.resource.push(req.body.resource)
	if (req.body.dateDue) createdLesson.dateDue = req.body.dateDue

	try {
		const lessonSession = await startSession()
		lessonSession.startTransaction()
		await createdLesson.save({ session: lessonSession })
		classroom.lessons.push(createdLesson)
		await classroom.save({ session: lessonSession })
		await lessonSession.commitTransaction()
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}
	req.flash('success', {msg: "Lesson successfully created."})
	res.redirect("back");
  },
  deleteLesson: async (req, res) => {
		const lessonId = req.body.lessonId
		const classroomId = req.body.classroomId
		const foundClassroom = await Classroom.findById(classroomId)
		const foundComments = await Comment.find({ lesson: lessonId })
		const commentsToDelete = foundComments.map((obj) => obj._id)

		const lessonToDelete = await Lesson.findOne({
			_id: lessonId,
			creator: req.user
		})
			
		try {
			const lessonDelSession = await startSession()
			lessonDelSession.startTransaction()
			foundClassroom.lessons.pull({_id: lessonId})
			await Comment.deleteMany({ _id: {$in: [...commentsToDelete]} }).session(lessonDelSession);
			await lessonToDelete.deleteOne({ session: lessonDelSession })
			await foundClassroom.save({ session: lessonDelSession })
			await lessonDelSession.commitTransaction()
		} catch (error) {
			req.flash('error', {msg: "Error. Please try again."})
			console.error(error)
			return res.redirect('back')
		}
		req.flash('success', {msg: `Lesson successfully deleted.`})
		res.redirect("back")
  },
};
