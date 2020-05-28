var express = require('express');
var router = express.Router()
var multer = require('multer')

var upload = multer({dest: './public/uploads/'})
var controller = require('../controller/product.controller');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('/',authMiddleware.requireAuth,controller.index);
router.get('/create',authMiddleware.requireAuth,controller.getCreate);
router.post('/create',upload.single('picture'),authMiddleware.requireAuth,controller.postCreate);
router.get('/:id/edit',authMiddleware.requireAuth,controller.get_editProduct);
router.post('/:id/edit',authMiddleware.requireAuth,controller.post_editProduct);
router.get('/:id/delete',authMiddleware.requireAuth,controller.deleteProduct);
router.get('/search',authMiddleware.requireAuth,controller.searchProduct);

module.exports = router;