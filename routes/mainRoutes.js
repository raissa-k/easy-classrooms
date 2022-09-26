const express = require("express");
const router = express.Router();
const authController = require("../controllers/authCtrl");
const userController = require("../controllers/userCtrl")
const homeController = require("../controllers/homeCtrl");
const classroomController = require("../controllers/classroomCtrl");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const apicache = require('apicache')
const cache = apicache.middleware

//Main Routes - simplified for now cache('10 minutes')
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, userController.getPrivateProfile);
router.get("/feed", ensureAuth, classroomController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
