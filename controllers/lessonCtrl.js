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
  likeComment: async (req, res) => {
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
		req.body.id, 
		{ 
			$inc: { likes: 1 }
		},
		{ new: true } 
		)
      res.json(updatedComment);
	  console.log('Likes +1')
    } catch (err) {
      res.status(400).end;
    }
  },
  deleteLesson: async (req, res) => {
    try {
		const lessonId = req.body.lessonId
		await Lesson.findOneAndDelete({
				_id: lessonId,
				creator: req.user
			})
      	await Comment.deleteMany({ lesson: lessonId });
		req.flash('success', {msg: "Lesson successfully deleted."})
		res.redirect("back");
    } catch (err) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
    }
  },
};
