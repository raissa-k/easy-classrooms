const cloudinary = require('../middleware/cloudinary')
const User = require('../models/User')
const Enrollment = require('../models/Enrollment')

module.exports = {
	getPrivateProfile: async (req, res) => {
		let userEnrollment
		try {
			userEnrollment = await Enrollment.find({ student: req.user.id }).populate({
				path: 'classroom',
				populate: { path: 'lessons' }
			})
		} catch (err) {
			req.flash('error', { msg: 'Error. Could not access user information.' })
			res.redirect('back')
			console.log(err)
		}
		res.render('profile.ejs', { user: req.user, enrollment: userEnrollment })
	},
	updateInfo: async (req, res) => {
		const action = req.body.update

		let userToUpdate
		try {
			userToUpdate = await User.findById(req.user.id)
		} catch (err) {
			console.error(err)
		}

		if (action == 'picture') {
			try {
				const result = await cloudinary.uploader.upload(req.file.path, { width: 100, height: 100, crop: 'fill', gravity: 'auto' })
				userToUpdate.profile = result.secure_url
				await userToUpdate.save()
			} catch (error) {
				console.error(error)
			}
			req.flash('success', { msg: 'New picture successfully uploaded!' })
			res.redirect('back')
		}

		if (action == 'info') {
			let newName = req.body.newName
			let newEmail = req.body.newEmail
			let newStatus = req.body.educator

			if (!req.body.newName) newName = userToUpdate.userName
			if (!req.body.newEmail) newEmail = userToUpdate.email
			if (!req.body.educator) newStatus = userToUpdate.educator

			userToUpdate.userName = newName
			userToUpdate.email = newEmail
			userToUpdate.educator = newStatus

			try {
				await userToUpdate.save()
			} catch (error) {
				console.error(error)
			}
			req.flash('success', { msg: 'User information updated successfully.' })
			res.redirect('back')
		}
	},
	updatePassword: async () => {

	},
	updateBio: async () => {

	}
}
