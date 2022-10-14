const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userCtrl")
const classroomController = require("../controllers/classroomCtrl");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/feed", ensureAuth, classroomController.getClassroomsFeed);
router.get("/private/:accessName", ensureAuth, classroomController.getPrivateClassroom)
router.get("/public/:accessName", classroomController.getPrivateClassroom)

router.get("/teacher", ensureAuth, classroomController.getTeacherDashboard)
router.get("/teacher/:accessName", ensureAuth, classroomController.getClassroomManagement)

router.post("/create", upload.single("picture"), classroomController.createClassroom)
router.delete("/", classroomController.deleteClassroom)
router.patch("/", upload.single("picture"), classroomController.editClassroom)

module.exports = router;