const validator = require("validator");
const { startSession } = require("mongoose");
const { uniqueNamesGenerator, adjectives, names, colors, animals } = require('unique-names-generator');
const cloudinary = require("../middleware/cloudinary");
const Classroom = require("../models/Classroom");
const Comment = require("../models/Comment")
const User = require("../models/User")
const Enrollment = require('../models/Enrollment');

const randomAccess = uniqueNamesGenerator({
	dictionaries: [adjectives, names, animals, colors],
	separator: '-',
	length: 3,
  });

module.exports = {
	getClassroomsFeed: async (req, res) => {
		let userClassrooms
		try {
			await Enrollment.find({ student: req.user.id }).populate({
				path: 'classroom',
				populate: { path: 'lessons' }
			}).exec((err, enrolledClassrooms) =>
			userClassrooms = enrolledClassrooms)
			res.render("classroom-feed.ejs", { classrooms: userClassrooms, user: req.user });
		} catch (err) {
			console.log(err);
		}
	},
	getPrivateClassroom: async (req, res) => {
		try {
			const classroom = await Classroom.findById(req.params.id);
			const comment = await Comment.find({ classroom: req.params.id });
			res.render("classroom-private.ejs", { classroom: classroom, user: req.user, comment: comment });
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
	getClassroomManagement: async(req, res) => {
		try {
            let managedClassroom = await Classroom.findOne({
                accessName: req.params.accessName,
                creator: req.user
            }).populate('lessons')
			res.render('classroom-manage.ejs', { classrooms: managedClassroom, user: req.user })
		} catch (error) {
			req.flash("error", error)
			return res.redirect("back")
		}
	},
	createClassroom: async (req, res) => {
		let newAccessName = randomAccess
		Classroom.findOne({ accessName: newAccessName },
			(err, existingAccess) => {
			  if (err) {
				return next(err);
			  }
			  if (existingAccess) {
				req.flash("error", {
				  msg: "Please try again.",
				});
				return res.redirect("back");
			  }})

		// ensure a picture if none is provided
		let imageToUpload
		if (!req.file){
			imageToUpload = "https://placeimg.com/640/480/nature/grayscale"
		} else {
			imageToUpload = req.file.path
		}

		let image
		let cloudinaryId
		try {
			const result = await cloudinary.uploader.upload(imageToUpload, 
				{ width: 400, height: 300, crop: 'fill', gravity: 'auto' 
			})
			image = result.secure_url
			cloudinaryId = result.public_id
		} catch (error) {
			req.flash("error", error)
			return res.redirect("back")
		}

		// placeholder to be saved in transaction
		const createdClassroom = new Classroom({
			name: req.body.name,
			description: req.body.description,
			image: image,
			cloudinaryId: cloudinaryId,
			accessName: newAccessName,
			creator: req.user.id
		})

		let user
		try {
			user = await User.findById(req.user.id)
		} catch (error) {
			console.error(error)
		}
		
		try {
			const classroomSession = await startSession()
			classroomSession.startTransaction()
			await createdClassroom.save({ session: classroomSession })
			user.classrooms.push(createdClassroom)
			await user.save({ session: classroomSession })
			await classroomSession.commitTransaction()
		} catch (error) {
			console.error(error)
		}

		req.flash('success', {msg: `Classroom "${req.body.name}" created.`})
		res.redirect("back");
	},
	editClassroom: async (req, res) => {
		let foundClassroom = await Classroom.findOne({
			_id: req.params.id,
			creator: req.user
		})

		if (req.body.accessName !== foundClassroom.accessName){
			Classroom.findOne({ accessName: req.body.accessName },
				(err, existingAccess) => {
				  if (err) {
					return next(err);
				  }
				  else if (existingAccess) {
					req.flash("error", {msg: "Classroom password in use, please choose another."})
					return res.redirect(`/classroom/teacher/${foundClassroom.accessName}`)
				}})
				return req.body.accessName
			}

		let classroomImage
		let cloudinaryId
		if (!req.file){
			classroomImage = foundClassroom.image
			console.log(classroomImage)
			cloudinaryId = foundClassroom.cloudinaryId
		} else {
			imageToUpload = req.file.path
			currendCloudId = foundClassroom.cloudinaryId
			try {
				const result = await cloudinary.uploader.upload(imageToUpload, 
					{ width: 400, height: 300, crop: 'fill', gravity: 'auto' 
				})
				await cloudinary.uploader.destroy(currendCloudId);
				classroomImage = result.secure_url
				cloudinaryId = result.public_id
			} catch (error) {
				req.flash("error", error)
				res.redirect(`/classroom/teacher/${foundClassroom.accessName}`)
			}
		}

		foundClassroom.name = req.body.name
		foundClassroom.description = req.body.description
		foundClassroom.image = classroomImage
		foundClassroom.cloudinaryId = cloudinaryId
		foundClassroom.accessName = req.body.accessName

		try {
			await foundClassroom.save()
		} catch (error) {
			console.error(error)
		}
		req.flash('success', {msg: `Classroom "${req.body.name}" edited.`})
		res.redirect(`/classroom/teacher/${foundClassroom.accessName}`)
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
