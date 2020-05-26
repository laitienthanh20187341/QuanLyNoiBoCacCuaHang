var express = require('express');
var router = express.Router();
var controller = require('../controller/customer.controller');
var middleware = require('../middlewares/auth.middleware');

router.get('/register',controller.get_register);
router.post('/register',controller.post_register);
router.get('/login',controller.getLogin);
router.post('/login',controller.postLogin);
router.get('/logout',controller.logout);
router.get('/show',middleware.requireAuth,controller.showCustomer);
router.get('/search', middleware.requireAuth,controller.searchCustomer);
router.get('/edit/:id',controller.getEditCustomer);
router.post('/edit/:id',controller.postEditCustomer);
router.get('/changepassword/:id',controller.get_changePassword);
router.post('/changepassword/:id',controller.post_changePassword);

module.exports = router;