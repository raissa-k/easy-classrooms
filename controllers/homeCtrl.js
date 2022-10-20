const fetch = require('node-fetch')
global.fetch = fetch
const { createApi } = require('unsplash-js')
require('dotenv').config({ path: './config/.env' })
const Enrollment = require('../models/Enrollment');

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_CLIENT_ID
})

module.exports = {
    getIndex: async (req,res)=>{
        let data
        await unsplash.photos.getRandom({ query: 'work from home', orientation: 'portrait', count: 1})
        .then(result => {
            data = result.response
        })
        .catch(error => console.error(error))
        res.render('index.ejs', {data: data})            
    },
	home: async (req, res) => {
		try {
			const enrollment = await Enrollment.find({ student: req.user }).populate({ path: 'classroom', populate: { path: 'lessons' } })
			const userClassrooms = enrollment.map((obj) => obj.classroom)
			const userLessons = enrollment.map((obj) => obj.classroom.lessons)
			const lessonCount = enrollment.map((obj) => obj.lessonCompletion)
			let incompleteLessons = lessonCount.reduce((incompleteLessons, el) => {
				if (!el.complete) incompleteLessons.push(el)
				return incompleteLessons
			}, [])
			const incompleteCount = incompleteLessons.flat()
			res.render("home.ejs", { classrooms: userClassrooms, lessons: userLessons, lessonCompletion: lessonCount, incompleteLessons: incompleteCount, user: req.user });
		} catch (err) {
			console.log(err);
		}
	}
}