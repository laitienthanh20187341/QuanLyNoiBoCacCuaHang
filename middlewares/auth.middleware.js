var con = require('../mysql-connection');

module.exports.requireAuth = function(req, res ,next){
    if(!req.session.userId) {
        res.redirect('/auth/login');
        return;
    }
    con.query('SELECT * FROM users WHERE id = ?', req.session.userId, function (err, result) { 
        if (err) throw err;
        if(!result[0]){
            res.redirect('/auth/login');
        }
        res.locals.user = result[0];
        next()
  });
};

module.exports.requireSignin = function(req,res,next){
    if(!req.session.customerId){
        res.redirect('/');
        return;
    }
    con.query('SELECT * FROM customer WHERE id = ?', req.session.customerId, function(err,result){
        if(!result[0]){
            res.redirect('/');
        }
        res.locals.user = result[0];
        next();
    })
}