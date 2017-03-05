//Express
var express = require('express');
var app = express();
var braintree = require("braintree");
app.use(express.static(__dirname + '/public'));
var gateway = braintree.connect({
  environment:braintree.Environment.Sandbox,
  merchantId: "tjx9zq5ydqmhxrv8",
  publicKey: "49pbb6r68jbq2fvc",
  privateKey: "2961f10337a7a32788815f6299eff56d"
})

//Passport
var passport = require('passport');
require('./config/passport')(passport); // pass passport for configuration
var OrderCtrl =			require('./controller/OrderCtrl');
var StoreInfoCtrl =			require('./controller/StoreInfoCtrl');
//Cookie and session
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(session({
  secret: 'this is the secret'
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//Body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'})); //for parsing application/json
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));


app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});



//Load .env file
var dotenv = require('dotenv');
dotenv.load();

app.post('/order', OrderCtrl.create);
app.get('/order', OrderCtrl.read);
app.put('/order', OrderCtrl.update);
app.delete('/order/:id', OrderCtrl.delete);

app.post('/storeInfoRel', StoreInfoCtrl.create);
app.get('/storeInfo', StoreInfoCtrl.read);
app.put('/storeInfoRel', StoreInfoCtrl.update);
app.delete('/storeInfoRel/:id', StoreInfoCtrl.delete);

// routes ======================================================================
require('./routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.listen(3000);