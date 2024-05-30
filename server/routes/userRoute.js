const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const {auth} = require('../middleware/auth');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.patch('/favorite',auth, UserController.favorite);
router.get('/favorites',auth, UserController.getFavorites);
router.get('/favDetails',auth, UserController.getFavoritesDetails);
router.get('/profile',auth, UserController.profile);
router.delete('/delete',auth, UserController.delete);
router.get('/settings',auth, UserController.getSettings)
router.patch('/settings',auth, UserController.updateSettings);
router.patch('/settings/password',auth, UserController.changePassword);
router.patch('/avatar',auth, UserController.changeAvatar);
//router.post('/forgotPassword', UserController.forgotPassword);
//router.get('/reset-password/:token', UserController.verifyToken)
//router.post('/reset-password/:token', UserController.resetPassword);
router.get('/logout',auth, UserController.logout)

module.exports = router;