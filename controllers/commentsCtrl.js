const { startSession } = require("mongoose");
const Comment = require("../models/Comment");
const Lesson = require("../models/Lesson")

module.exports = {
  createComment: async (req, res) => {
	let lessonId = req.params.lessonId
	let comment = req.body.comment
	let foundLesson
	try {
		foundLesson = await Lesson.findById(lessonId)
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}

	console.log(foundLesson)

	const createdComment = new Comment({
		comment: comment,
		lesson: lessonId,
		user: req.user.id
	})

	try {
		const commSession = await startSession()
		commSession.startTransaction()
		await createdComment.save({ session: commSession })
		foundLesson.comment.push(createdComment)
		await foundLesson.save({ session: commSession })
		await commSession.commitTransaction()
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}
	res.redirect("back");
  },
  deleteComment: async (req, res) => {
    const lessonId = req.params.lessonId
	const commentId = req.body.commentId

	const lesson = await Lesson.findById(lessonId)
    const commentToDelete = await Comment.findById(commentId);

	try {
		const commSession = await startSession()
		commSession.startTransaction()
		lesson.comment.pull({_id: commentId})
		await commentToDelete.remove({ session: commSession })
		await lesson.save({ session: commSession })
		await commSession.commitTransaction()
		req.flash('success', {msg: `Comment successfully deleted.`})
		res.redirect('back')
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}
}
};
