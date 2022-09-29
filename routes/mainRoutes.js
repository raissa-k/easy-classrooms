const express = require("express");
const router = express.Router();
const authController = require("../controllers/authCtrl");
const userController = require("../controllers/userCtrl")
const homeController = require("../controllers/homeCtrl");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const apicache = require('apicache')
const cache = apicache.middleware


router.get("/", cache('10 minutes'), homeController.getIndex);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.post("/test", homeController.test)

module.exports = router;
