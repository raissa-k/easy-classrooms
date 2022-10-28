const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const classroomController = require('../controllers/classroomCtrl')
const lessonController = require('../controllers/lessonCtrl')
const commentController = require('../controllers/commentsCtrl')
const { ensureAuth } = require('../middleware/auth')

router.get('/:accessName/view', classroomController.getClassroom)
router.get('/:accessName/edit', ensureAuth, classroomController.getClassroomManagement)

router.route('/:accessName/:lessonId', ensureAuth)
	.get(lessonController.getLesson)
	.post(commentController.createComment)
	.delete(commentController.deleteComment)

router.route('/', ensureAuth)
	.delete(classroomController.deleteClassroom)
	.patch(upload.single('picture'), classroomController.editClassroom)
	.post(upload.single('picture'), classroomController.createClassroom)

module.exports = router
