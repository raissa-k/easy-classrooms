const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const { ensureAuth } = require('../middleware/auth')
const userController = require('../controllers/userCtrl')

router.get('/profile', ensureAuth, userController.getPrivateProfile)

router.put('/update/picture', upload.single('file'), userController.updateInfo)
router.put('/update/', userController.updateInfo)

module.exports = router
