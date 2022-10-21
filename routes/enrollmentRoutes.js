const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const enrollmentController = require('../controllers/enrollmentCtrl');

router.post("/", ensureAuth, enrollmentController.enroll)

router.route("/:enrollmentId", ensureAuth)
	.delete(enrollmentController.removeEnrollment)
	.patch(enrollmentController.completeLesson)

router.param('enrollmentId', enrollmentController.findEnrollment)

module.exports = router;


