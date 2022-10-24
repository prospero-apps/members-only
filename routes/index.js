const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

/* HOME PAGE */
router.get('/', messageController.index);

/* CREATE MESSAGE */
router.get('/create-message', messageController.message_create_get);
router.post('/create-message', messageController.message_create_post);

/* DELETE MESSAGE */
router.post('/', messageController.message_delete_post);

/* USER SIGNUP */
router.get('/signup', userController.user_signup_get);
router.post('/signup', userController.user_signup_post);

/* USER LOGIN */
router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);

/* USER LOGOUT */
router.get('/logout', userController.user_logout_get);

/* USER BECOME MEMBER */
router.get('/member', userController.user_becomeMember_get);
router.post('/member', userController.user_becomeMember_post);

/* USER BECOME ADMIN */
router.get('/admin', userController.user_becomeAdmin_get);
router.post('/admin', userController.user_becomeAdmin_post);

module.exports = router;