const express = require('express')
const router = express.Router()
const lessonController = require('../controllers/lessonCtrl')

router.post('/:classroomId', lessonController.createLesson)
router.delete('/', lessonController.deleteLesson)
router.get('/:accessName/:lessonId', lessonController.getLesson)

module.exports = router
