const cloudinary = require("../middleware/cloudinary");
const Classroom = require("../models/Classroom");
const Enrollment = require('../models/Enrollment')

module.exports = {
	getClassroomsFeed: async (req, res) => {
		try {
			let userClassrooms
			if (req.user.educator) {
				userClassrooms = await Classroom.find({ creator: req.user })
			} else {
				await Enrollment.find({ student: req.user }).populate('classroom').exec((err, enrolledClassrooms) =>
					userClassrooms = enrolledClassrooms)
			}
			res.render("classroom-feed.ejs", { classrooms: userClassrooms, user: req.user });
		} catch (err) {
			console.log(err);
		}
	},
	getOneClassroom: async (req, res) => {
		try {
			const classroom = await Classroom.findById(req.params.id);
			const comment = await Comment.find({ classroom: req.params.id });
			res.render("course-classroom.ejs", { classroom: classroom, user: req.user, comment: comment });
		} catch (err) {
			console.log(err);
		}
	},
	getTeacherDashboard: async(req, res) => {
		if (!req.user.educator){
			req.flash('error', {msg:'Only educators may access the Course Dashboard'})
			res.redirect('/classroom/feed')
		} else {
			try {
				userClassrooms = await Classroom.find({ creator: req.user }).populate('lessons')
				res.render("teacher-panel.ejs", { classrooms: userClassrooms, user: req.user })
			} catch (error) {
				console.error(error)
			}}
	},
	createClassroom: async (req, res) => {
		try {
			// Upload image to cloudinary
			const result = await cloudinary.uploader.upload(req.file.path);

			await Classroom.create({
				title: req.body.title,
				image: result.secure_url,
				cloudinaryId: result.public_id,
				caption: req.body.caption,
				likes: 0,
				user: req.user.id,
			});
			res.redirect("/teacher");
		} catch (err) {
			console.log(err);
		}
	},
	updateClassroom: async (req, res) => {
		try {
			await Classroom.findByIdAndUpdate(
				req.body.id,
				{
					$inc: { likes: 1 },
				}
			);
			res.json('Liked!');
		} catch (err) {
			console.log(err);
		}
	},
	deleteClassroom: async (req, res) => {
		try {
			// Find classroom by id
			let classroom = await Classroom.findById({ _id: req.body.id });
			// Delete image from cloudinary
			await cloudinary.uploader.destroy(classroom.cloudinaryId);
			// Delete classroom from db
			await Classroom.deleteOne({ _id: req.params.id });
			res.json('Deleted classroom');
		} catch (err) {
			console.error(err)
		}
	},
};
