var express = require('express');
var router = express.Router();
var controller = require('../controller/store.controller')
var authMiddleware = require('../middlewares/auth.middleware');

router.get('/',authMiddleware.requireAuth,controller.index);

router.get('/create',authMiddleware.requireAuth,controller.getCreate);

router.post('/create',authMiddleware.requireAuth,controller.postCreate);

router.get('/:storeId/edit',authMiddleware.requireAuth,controller.get_editStore);

router.post('/:storeId/edit',authMiddleware.requireAuth,controller.post_editStore);

router.get('/:storeId/delete',authMiddleware.requireAuth,controller.deleteStore);

router.get('/search',authMiddleware.requireAuth,controller.searchStore);

module.exports = router;