const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userCtrl")
const classroomController = require("../controllers/classroomCtrl");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/feed", ensureAuth, classroomController.getClassroomsFeed);
router.get("/private/:id", ensureAuth, classroomController.getPrivateClassroom)

router.get("/teacher", classroomController.getTeacherDashboard)
router.get("/teacher/:accessName", classroomController.getClassroomManagement)

router.post("/create", upload.single("picture"), classroomController.createClassroom)
router.post("/edit/:id", upload.single("picture"), classroomController.editClassroom)

module.exports = router;