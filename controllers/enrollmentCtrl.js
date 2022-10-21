const Enrollment = require('../models/Enrollment');
const Classroom = require('../models/Classroom')
const Comment = require('../models/Comment')

module.exports = {
	enroll: async (req, res) => {
		let classId = req.body.classroom
		let classroomToEnroll

		try {
			let foundClassroom = await Classroom.findById(classId).populate('lessons')
			if(!foundClassroom){
				req.flash('error', {msg: 'Could not find classroom.'})
				return res.redirect('back')
			}
			classroomToEnroll = foundClassroom
		} catch (error) {
			req.flash('error', {msg: "Error. Please try again."})
			console.error(error)
			return res.redirect('back')
		}

		let newEnrollment = {
			classroom: req.body.classroom,
			student: req.user,
		}

		newEnrollment.lessonCompletion = classroomToEnroll.lessons.map((lesson) => {
			return { lesson: lesson, complete: false }
		})

		const enrollment = new Enrollment(newEnrollment)
		try {
			await enrollment.save()
		} catch (err) {
			req.flash('error', {msg: "Error. Please try again."})
			console.error(err)
			return res.redirect('back')
		}
		req.flash('success', {msg: `Successfully enrolled in "${classroomToEnroll.name}".`})
		res.redirect("back")
	},
	completeLesson: async (req, res) => {
		console.log(req.body)
		let enrollmentToUpdate = req.params.enrollmentId
		let lessonId = req.body.lessonId
		let completed = req.body.completed ? true : false
		console.log(completed)

		try {
			await Enrollment.updateOne( {_id: enrollmentToUpdate, "lessonCompletion.lesson": lessonId }, { $set: {"lessonCompletion.$.complete": completed }})
		} catch (error) {
			req.flash("error", {msg: "Error. Please try again."})
			console.error(err)
			return res.redirect("back")
		}
		req.flash("info", {msg: "Lesson completion updated."})
		res.redirect("back")
	},
	removeEnrollment: async (req, res) => {
		let enrollmentId = req.params.enrollmentId

		let enrollmentToDelete = await Enrollment.findById(enrollmentId)
		let enrollmentLessons = enrollmentToDelete.lessonCompletion.map((obj) => obj.lesson)

		try {
			await enrollmentToDelete.deleteOne()
			await Comment.deleteMany({ user: req.user, lesson: {$in: [...enrollmentLessons]}})
		} catch (err) {
			req.flash("error", {msg: "Error. Please try again."})
			console.error(err)
			return res.redirect("back")
		}
		req.flash("success", {msg: "Your enrollment has been cancelled."})
		res.redirect("back")
	}
}