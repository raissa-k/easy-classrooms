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
  deleteComment: async (req, res) => {
    try {
      // Find Comment by id
      let Comment = await Comment.findById({ _id: req.params.id });
      // Delete Comment from db
      await Comment.remove({ _id: req.params.id });
      console.log("Deleted Comment");
      res.redirect("/user/profile");
    } catch (err) {
      res.redirect("/user/profile");
    }
  },
};
