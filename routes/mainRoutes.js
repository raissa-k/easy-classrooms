const express = require('express')
const router = express.Router()
const authController = require('../controllers/authCtrl')
const homeController = require('../controllers/homeCtrl')
const classroomController = require('../controllers/classroomCtrl')
const { ensureAuth } = require('../middleware/auth')
const apicache = require('apicache')
const cache = apicache.middleware

router.get('/', cache('10 minutes'), homeController.getIndex)
router.get('/home', ensureAuth, homeController.home)
router.get('/teacher', ensureAuth, classroomController.getTeacherDashboard)
router.post('/find', classroomController.findByPass)

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router
