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
		let userClassrooms
		try {
			await Enrollment.find({ student: req.user.id }).populate({
				path: 'classroom',
				populate: { path: 'lessons' }
			}).exec((err, enrolledClassrooms) =>
			userClassrooms = enrolledClassrooms)
			res.render("home.ejs", { classrooms: userClassrooms, user: req.user });
		} catch (err) {
			console.log(err);
		}
	}
}