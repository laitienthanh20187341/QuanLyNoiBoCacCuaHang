var con = require('../mysql-connection');

module.exports.index = function(req,res){
    con.query('SELECT * FROM products', function(err,result){
        if(err) throw err;
        res.render('admin/product/index',{products: result});
    })
}

module.exports.getCreate = function(req,res){
    con.query('SELECT * FROM stores',function(err,result){
        if(err) throw err;
        res.render('admin/product/create',{stores: result})
    })
}

module.exports.postCreate = function(req,res){
    var errors = [];
    if(!req.body.name){
        errors.push("Name is required");
    }
    if(!req.body.price){
        errors.push("Price is required");
    }
    if(!req.body.quantity){
      errors.push("Quantity is required");
    }
    if(errors.length){
        res.render('admin/product/create', {
            errors: errors,
            values: req.body
        });
        return;
    }

    req.body.picture = req.file.path.split('\\').slice(1).join('\\');

    var values = [
        req.body.name,
        req.body.price,
        req.body.storeId,
        req.body.quantity,
        req.body.picture
    ]
    con.query('INSERT INTO products (name,price,storeId,quantity,picture) VALUES (?)',[values],function(err,result){
        if(err) throw err;
        console.log("1 record inserted");
        res.redirect('/product');
    })
}

module.exports.get_editProduct = function(req,res){
    var id = req.params.id;
    con.query('SELECT * FROM products WHERE id = ?',id,function(err,result){
        if(err) throw err;
        res.render('admin/product/edit', {products: result});
    })
}

module.exports.post_editProduct = function(req,res){
    var id = req.params.id;
    var picture = req.body.picture;
    if(picture != ""){
        con.query("UPDATE products SET name = ?, price = ?, quantity = ?, picture = ? WHERE id = ?",[req.body.name, req.body.price, req.body.quantity, req.body.picture, id], function(err,result){
            if(err) throw err
            return redirect('/product')
        })
    } else {
        con.query("UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?",[req.body.name, req.body.price, req.body.quantity, id], function(err,result){
            if(err) throw err
            return redirect('/product')
        })
    }
}

module.exports.deleteProduct = function(req,res){
    var id = req.params.id;
    con.query('DELETE FROM products WHERE id = ?', id,function(err,result){
        if(err) throw err;
        return redirect('/product');
    })
}

module.exports.searchProduct = function(req,res){
    var q = req.query.q
    con.query('SELECT * FROM products', function(err,result){
        if(err) throw err;
        var matchedProduct = result.filter(function(products){
            return products.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        res.render('admin/product/index',{products: matchedProduct})
    })
}