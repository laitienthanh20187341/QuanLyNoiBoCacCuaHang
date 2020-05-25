var con = require('../mysql-connection');
var md5 = require('md5');

module.exports.get_register = function(req,res){
    con.query('SELECT * FROM stores', function(err,result){
        if(err) throw err;
        res.render('customer/register',{stores: result});
    })
    
}

module.exports.post_register = function(req,res){
    var errors = [];
    if(!req.body.name){
        errors.push("Name is required");
    }
    if(!req.body.password){
        errors.push("Password is required");
    }
    if(!req.body.email){
      errors.push("Email is required");
    }
    if(!req.body.phone){
        errors.push("Phone is required");
    }
    if(errors.length){
        res.render('customer/register', {
            errors: errors,
            values: req.body
        });
        return;
    }

    var values = [
        req.body.name,
        md5(req.body.password),
        req.body.email,
        req.body.phone,
        req.body.storeId
    ]

    con.query('INSERT INTO customer (name,password,email,phone,storeId) VALUES (?)',[values],function(err,result){
        if(err) throw err;
        console.log('1 record inserted');
        res.redirect('/')
    })
}

module.exports.getLogin = function(req,res){
    res.render('customer/login');
}

module.exports.postLogin = function(req,res){
    var email = req.body.email;
    var password = req.body.password

    con.query("SELECT * FROM customer WHERE email = ?",[email],function(err,result){
        if(err) throw err;
        if(result[0] === undefined || result[0].email !== email) {
            res.render('customer/login', {
                errors: [
                    'Email does not exists'
                ],
                values: req.body
            });
            return;
        }
        var hashedPassword = md5(password)

        if(result[0].password !== hashedPassword){
            res.render('customer/login', {
                errors: [
                    'Wrong password!'
                ],
                values: req.body
            });
            return;
        }
        req.session.customerName = result[0].name
        req.session.customerId = result[0].id;
        req.session.storeId = result[0].storeId; 
        req.session.cart = {};
        console.log(req.session.customerId);
        console.log(req.session.storeId);
        console.log(req.session.cart);
        res.redirect('/');
    });
}

module.exports.logout = function(req,res){
    req.session.destroy();
    res.redirect('/')
}

module.exports.showCustomer = function(req,res) {
    con.query('SELECT * FROM customer', function(err,result){
        if(err) throw err;
        res.render('admin/customer/index', {customers:result})
    })
}

module.exports.searchCustomer = function(req,res) {
    var q = req.query.q
    con.query('SELECT * FROM custimer', function(err,result){
        if(err) throw err;
        var matchedCustomer = result.filter(function(customers){
            return customers.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        res.render('admin/customer/index', {customers: matchedCustomer});
    })
}

module.exports.getEditCustomer = function(req,res){
    var id = req.params.id;
    con.query("SELECT * FROM customer WHERE id = ?", [id], function(err,result){
        if(err) throw err;
        res.render('customer/edit', {customer: result})
    })
}

module.exports.postEditCustomer = function(req,res){
    var id = req.params.id;
    con.query('UPDATE customer SET name = ?, email = ?, phone = ? WHERE id = ?',[req.body.name,req.body.email,req.body.phone,id],function(err,result){
        if(err) throw err;
        res.redirect('/');
    })
}

module.exports.get_changePassword = function(req,res) {
    con.query('SELECT * FROM customer WHERE id = ?',[req.session.customerId], function(err,result){
        if(err) throw err;
        res.render('customer/changePassword',{customer:result});
    })
    
}

module.exports.post_changePassword = function(req,res){
    var id = req.params.id;
    var errors = [];
    if(!req.body.oldpassword){
      errors.push('old password is required !')
    }
    if(!req.body.newpassword){
      errors.push('new password required !')
    }
    if(!req.body.confirmpassword){
      errors.push('Confirm password required !')
    }
    if(req.body.newpassword != req.body.confirmpassword) {
      errors.push('Wrong password !')
    }
  if(errors.length){
    res.render('admin/users/changePassword', {
        errors: errors,
        values: req.body
    });
    return;
}
var oldpassword = req.body.oldpassword;
var hashed_oldpaasword = md5(oldpassword);
var newPassword = req.body.newPassword;
var hashedPassword = md5(newPassword);
con.query('SELECT * FROM customer WHERE id = ?',[id], function(err,result){
  if(err) throw err;
  if(result[0].password == hashed_oldpaasword) {
      con.query('UPDATE customer SET password = ? WHERE id = ?',[hashedPassword,id],function(err,result){
          if(err) throw err;
          res.redirect('/');
      })
  }
})
}