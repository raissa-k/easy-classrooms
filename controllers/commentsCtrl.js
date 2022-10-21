const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
	let lessonId = req.params.lessonId
	let comment = req.body.comment

	const createdComment = new Comment({
		comment: comment,
		lesson: lessonId,
		user: req.user.id
	})

	try {
		await createdComment.save()
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}
	res.redirect("back");
  },
  deleteComment: async (req, res) => {
	const commentId = req.body.commentId
	try {
		await Comment.findByIdAndRemove(commentId);
		req.flash('success', {msg: `Comment successfully deleted.`})
		res.redirect('back')
	} catch (error) {
		req.flash('error', {msg: "Error. Please try again."})
		console.error(error)
		return res.redirect('back')
	}
}
};
