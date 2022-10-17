const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const classroomController = require("../controllers/classroomCtrl");
const lessonController = require("../controllers/lessonCtrl")
const enrollment = require("../middleware/enrollment")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:accessName/view", classroomController.getClassroom)
router.get("/:accessName/edit", ensureAuth, classroomController.getClassroomManagement)
router.get("/:accessName/:lessonId", lessonController.getLesson)

router.route("/")
	.delete(classroomController.deleteClassroom)
	.patch(upload.single("picture"), classroomController.editClassroom)
	.post(upload.single("picture"), classroomController.createClassroom)

router.param('enrollmentId', enrollment.findEnrollment)

module.exports = router;