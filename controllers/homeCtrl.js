const fetch = require('node-fetch')
global.fetch = fetch
const { createApi } = require('unsplash-js')
require('dotenv').config({ path: './config/.env' })
const Enrollment = require('../models/Enrollment')

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_CLIENT_ID
})

module.exports = {
	getIndex: async (req, res) => {
		let data
		await unsplash.photos.getRandom({ query: 'work from home', orientation: 'portrait', count: 1 })
			.then(result => {
				data = result.response
			})
			.catch(error => console.error(error))
		res.render('index.ejs', { data, bg: 'no' })
	},
	home: async (req, res) => {
		try {
			const enrollment = await Enrollment.find({ student: req.user }).populate({ path: 'classroom', populate: { path: 'lessons' } })
			const userClassrooms = enrollment.map((obj) => obj.classroom)
			const lessonCount = enrollment.map((obj) => obj.lessonCompletion)
			const completeLessons = lessonCount.flat().reduce((completeLessons, el) => {
				if (el.complete === true) completeLessons.push(el)
				return completeLessons
			}, [])
			const completeCount = completeLessons.length
			const totalCount = lessonCount.flat().length
			console.log(completeCount, totalCount)
			res.render('home.ejs', { classrooms: userClassrooms, lessons: userClassrooms.lessons, total: totalCount, completeLessons: completeCount, user: req.user })
		} catch (err) {
			console.log(err)
		}
	}
}
