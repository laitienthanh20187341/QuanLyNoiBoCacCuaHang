var con = require('../mysql-connection');
var md5 = require('md5');
const shortid = require('shortid');

module.exports.index = function (req, res) {
    con.query('SELECT * FROM users', function (err, results) { // retrieve data 
    if (err) throw err;
    res.render('admin/users/index', { users: results});
  });
};

module.exports.getCreate = function(req, res) {
  con.query('SELECT * FROM stores',function(err,result){
    if(err) throw err;
    res.render('admin/users/create',{stores: result});
  });
};

module.exports.postCreate = function(req, res) {
    var errors = [];
    if(!req.body.username){
        errors.push("Username is required");
    }
    if(!req.body.password){
        errors.push("Password is required");
    }
    if(!req.body.name){
        errors.push("Name is required");
    }
    if(!req.body.phone){
        errors.push("Phone number is required");
    }
    if(!req.body.address){
      errors.push("Address is required");
    }
    if(!req.body.datein){
      errors.push("Date in is required");
    }

    if(errors.length){
        res.render('admin/users/create', {
            errors: errors,
            values: req.body
        });
        return;
    }
    req.body.id = shortid.generate();
    values = [
      req.body.id,
      req.body.username,
      md5(req.body.password),
      req.body.name,
      req.body.gender,
      req.body.phone,
      req.body.address,
      req.body.datein,
      req.body.storeId
    ]

    con.query('INSERT INTO users (id, username, password, name, gender, phone, address, datein, storeId) VALUES (?)',[values], function(err, result){
      if(err) throw err;
        console.log("1 record inserted");
    });
    res.redirect('/users')
}

module.exports.get_editUser = function(req,res){
    var id = req.params.userId
    con.query('SELECT * FROM users WHERE id = ?', id , function(err, result){
      if(err) throw err;
      res.render('admin/users/edit',{users: result});
    });
}

module.exports.post_editUser = function(req,res){
  var id = req.params.userId
  con.query('UPDATE users SET username = ?, name= ?, gender= ?, phone= ?, address= ?, datein= ? WHERE id =?', [req.body.username, req.body.name, req.body.gender, req.body.phone, req.body.address, req.body.datein, id],function(err, result){
    if(err) throw err;
    res.redirect('/users');
  })
}

module.exports.deleteUser = function(req,res){
  var id = req.params.userId
  con.query('DELETE FROM users WHERE id = ?',id,function(err,result){
    if(err) throw err;
    res.redirect('/users');
  })
}

module.exports.searchUser = function(req,res){
  var q = req.query.q
  con.query('SELECT * FROM users', function(err, result){
      if(err) throw err;
      var matchedStore = result.filter(function(users){
          return users.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      });
      res.render('admin/users/index', {users: matchedStore});
  });
}

module.exports.get_changePassword = function(req,res) {
    res.render('admin/users/changePassword')
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
  con.query('SELECT * FROM users WHERE id = ?',[id], function(err,result){
    if(err) throw err;
    if(result[0].password == hashed_oldpaasword) {
        con.query('UPDATE users SET password = ? WHERE id = ?',[hashedPassword,id],function(err,result){
            if(err) throw err;
            res.redirect('/users');
        })
    }
  })
}