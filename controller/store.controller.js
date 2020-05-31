var con = require('../mysql-connection')

module.exports.index = function(req,res){
    con.query('SELECT * FROM stores', function(err, results) {
        if(err) throw err;
        res.render('admin/store/index', {stores: results});
    });
};

module.exports.getCreate = function(req,res){
    res.render('admin/store/create')
}

module.exports.postCreate = function(req,res){
    var errors = [];
    if(!req.body.storeId){
        errors.push("Store Id is required");
    }
    if(!req.body.storeName){
        errors.push("Name is required");
    }
    if(!req.body.storeAddress){
        errors.push("Address is required");
    }
    if(!req.body.dateCreate){
        errors.push("Date open is required");
    }

    if(errors.length){
        res.render('admin/store/create', {
            errors: errors,
            values: req.body
        });
        return;
    }
    var values = [
        req.body.storeId,
        req.body.storeName,
        req.body.storeAddress,
        req.body.dateCreate
    ];
    con.query('INSERT INTO stores (storeId,storeName,storeAddress,dateCreate) VALUES (?)',[values], function(err, result) {
        if(err) throw err;
            console.log("1 record inserted");
    });
    res.redirect('/store')
};

module.exports.get_editStore = function(req,res) {
    var storeId = req.params.storeId
    con.query('SELECT * FROM stores WHERE storeId = ?', storeId, function(err, result){
        if (err) throw err;
        res.render('admin/store/edit', {stores: result});
    })
}

module.exports.post_editStore = function(req,res){
    var storeId = req.params.storeId
    con.query('UPDATE stores SET storeName = ?, storeAddress = ?, dateCreate = ? WHERE storeId = ?', [req.body.storeName, req.body.storeAddress, req.body.dateCreate, storeId],function(err, result){
        if(err) throw err;
        res.redirect('/store');
    })
}

module.exports.deleteStore = function(req,res) {
    var storeId = req.params.storeId
    con.query('DELETE FROM stores WHERE storeId = ?', storeId, function(err, result){
        if (err) throw err;
        res.redirect('/store');
    });
}

module.exports.searchStore = function(req,res){
    var q = req.query.q
    con.query('SELECT * FROM stores', function(err, result){
        if(err) throw err;
        var matchedStore = result.filter(function(store){
            return store.storeName.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        res.render('admin/store/index', {stores: matchedStore});
    });
}   
