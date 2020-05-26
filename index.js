var express = require('express');
var app = express();
var port = 3000;
var userRoute = require('./routes/users.route');
var authRoute = require('./routes/auth.route');
var storeRoute = require('./routes/store.route');
var productRoute = require('./routes/product.route');
var cartRoute = require('./routes/cart.route');
var cusRoute = require('./routes/customer.route');
var session = require('express-session');
var sessionMiddleware = require('./middlewares/session.middleware');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var path = require('path');

app.set('view engine', 'pug');
app.set('views', './views');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    cookie: { maxAge: 600000 },
    saveUninitialized: true
  }));
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
app.use(cookieParser('asdasd123123'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/store', storeRoute);
app.use('/product', productRoute);
app.use('/customer', cusRoute);
app.use('/', cartRoute);
app.use(sessionMiddleware);

app.listen(port, function(){
    console.log('Server listening on port ' + port);
});