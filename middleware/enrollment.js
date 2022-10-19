const Enrollment = require('../models/Enrollment');
const Classroom = require('../models/Classroom')

module.exports = {
	enroll: async (req, res) => {
		let classroomToEnroll 

		let newEnrollment = {
			classroom: req.body.classroom,
			student: req.user,
		}
		newEnrollment.lessonCompletion = req.classroom.lessons.map((lesson) => {
			return { lesson: lesson, complete: false }
		})
		const enrollment = new Enrollment(newEnrollment)
		try {
			let result = await enrollment.save()
			return res.status(200).json(result)
		} catch (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	},
	enrollmentByID: async (req, res, next, id) => {
		try {
			let enrollment = await Enrollment.findById(id)
				.populate({ path: 'course', populate: { path: 'instructor' } })
				.populate('student', '_id name')
			if (!enrollment)
				return res.status('400').json({
					error: "Enrollment not found"
				})
			req.enrollment = enrollment
			next()
		} catch (err) {
			return res.status('400').json({
				error: "Could not retrieve enrollment"
			})
		}
	},

	completeLesson: async (req, res) => {
		let updatedData = {}
		updatedData['lessonStatus.$.complete'] = req.body.complete
		updatedData.updated = Date.now()
		if (req.body.courseCompleted)
			updatedData.completed = req.body.courseCompleted

		try {
			let enrollment = await Enrollment.updateOne({ 'lessonStatus._id': req.body.lessonStatusId }, { '$set': updatedData })
			res.json(enrollment)
		} catch (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	},

	removeEnrollment: async (req, res) => {
		try {
			let enrollment = req.enrollment
			let deletedEnrollment = await enrollment.remove()
			res.json(deletedEnrollment)
		} catch (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	},

	isStudent: (req, res, next) => {
		const isStudent = req.auth && req.auth._id == req.enrollment.student._id
		if (!isStudent) {
			return res.status('403').json({
				error: "User is not enrolled"
			})
		}
		next()
	},

	listEnrolled: async (req, res) => {
		try {
			let enrollments = await Enrollment.find({ student: req.auth._id }).sort({ 'completed': 1 }).populate('course', '_id name category')
			res.json(enrollments)
		} catch (err) {
			console.log(err)
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	},

	findEnrollment: async (req, res, next) => {
		try {
			let enrollments = await Enrollment.find({ course: req.course._id, student: req.auth._id })
			if (enrollments.length == 0) {
				next()
			} else {
				res.json(enrollments[0])
			}
		} catch (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	},

	enrollmentStats: async (req, res) => {
		try {
			let stats = {}
			stats.totalEnrolled = await Enrollment.find({ course: req.course._id }).countDocuments()
			stats.totalCompleted = await Enrollment.find({ course: req.course._id }).exists('completed', true).countDocuments()
			res.json(stats)
		} catch (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
	}
}