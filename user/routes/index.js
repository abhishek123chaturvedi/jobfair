var express = require('express');
var router = express.Router();
var User = require('../controllers/user');

/* GET home page. */
router.get('/', User.getIndexPageTemplate);

router.get('/verification', User.getUserVerification);

router.get('/about', User.getAboutPageTemplate);

router.get('/contact', User.getContactPageTemplate);

router.get('/sign-in', User.getLoginPageTemplate);

router.get('/sign-up', User.getRegisterPageTemplate);

// POST
router.post('/register', User.registerUser,User.loginRedirect);
router.post('/login', User.login);
router.get('/logout', User.logout);


module.exports = router;
