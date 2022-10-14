const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonCtrl")

router.post("/add/:classroomId", lessonController.createLesson)

router.post("/delete", lessonController.deleteLesson)

module.exports = router;