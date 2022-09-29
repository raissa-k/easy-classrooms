const fetch = require('node-fetch')
global.fetch = fetch
const { createApi } = require('unsplash-js')
require('dotenv').config({ path: './config/.env' })

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
	test: async (req, res) => {
		console.log(req.body)
		req.flash('success', {msg: 'form submitted!'})
		req.flash('info', {msg: req.user.userName})
		res.redirect('back')
	}
}