var con = require('../mysql-connection');
var md5 = require('md5');

module.exports.login = function(req, res, next) {
    res.render('admin/auth/login');
}

module.exports.postLogin = function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    con.query('SELECT * FROM users WHERE username = ?',[username], function (err, result) { //result trả về 1 array chứa object
		//console.log(typeof result[0].username)
		if (err) throw err;
		if(result[0] === undefined || result[0].username !== username) {
			res.render('admin/auth/login', {
				errors:[
					'User does not exists'
				],
				values: req.body
			});
			return;
		}

		var hashedPassword = md5(password)

		if(result[0].password !== hashedPassword){
			res.render('admin/auth/login', {
				errors:[
					'Wrong password!'
				],
				values: req.body
			});
			return;
		}
		req.session.userId = result[0].id;
		req.session.storeId = result[0].storeId;
		req.session.cart = {};
    	res.redirect('/users');
});
}

module.exports.logout = function(req,res,next){
	res.clearCookie("userId");
	res.redirect('/')
}
	