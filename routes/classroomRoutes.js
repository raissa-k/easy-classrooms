const express = require("express");
const router = express.Router();
const userController = require("../controllers/userCtrl")
const classroomController = require("../controllers/classroomCtrl");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/feed", ensureAuth, classroomController.getClassroomsFeed);
router.get("/teacher", classroomController.getTeacherDashboard)

module.exports = router;