const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/mainRoutes')
const userRoutes = require('./routes/userRoutes')
const classroomRoutes = require('./routes/classroomRoutes')
const lessonRoutes = require('./routes/lessonRoutes')
const enrollmentRoutes = require('./routes/enrollmentRoutes')

require('dotenv').config({ path: './config/.env' })

require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(logger('dev'))

app.use(methodOverride('_method'))

app.use(
	session({
		secret: 'je suis un ananas',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/', mainRoutes)
app.use('/user', userRoutes)
app.use('/classroom', classroomRoutes)
app.use('/lesson', lessonRoutes)
app.use('/enroll', enrollmentRoutes)
app.use(function (req, res, next) {
	res.status(404).render('404.ejs', { bg: 'no' })
})

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})
