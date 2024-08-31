var express             = require('express');
var app                 = express();
var mongoose		    = require("mongoose");
var passport        	= require("passport");
var localStrategy   	= require("passport-local");
var bodyParser		    = require("body-parser");

var Web3                = require('web3');
var jsdom               = require('jsdom');
var $                   = require('jquery')(new jsdom.JSDOM().window);
var Window              = require('window');
var window              = new Window();

const tenderJSON        = require('../build/contracts/TenderAuction.json')
const truffleContract   = require('truffle-contract');
const consolidate       = require('consolidate');

var User                = require("./models/user");

//CREATING EXPRESS-SESSION
app.use(require("express-session")({
    secret: "Hi there",
    resave: false,
    saveUninitialized: false
}));

//SETTING UP PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));


app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.engine('ejs', require('ejs').renderFile);
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

//changed local host to 127

var mongoURI="mongodb://127.0.0.1/tenderAuction";
//var mongoURI=process.env.MONGOURI;

//CONNECTING WITH DATABASE
var connection=mongoose.connect(mongoURI,{useNewUrlParser:true});

app.get('/tenderJSON', (req,res) => {
    res.send(tenderJSON);
});

app.get('/truffleContract', (req,res) => {
    res.send(truffleContract);
});

app.get('/', (req,res) => {
    if(req.user) {
        if(req.user.type != 'false') {
            res.redirect('/dashboard');
        }else {
            res.redirect('/confirmType');
        }
    }else {
        res.redirect('/landing');
    }
});

app.get('/authenticate', (req,res) => {
    if(req.user) {
        res.redirect('/');
    }
    else{
        res.render('authnew.ejs');
    }
});

app.get('/signup', function(req, res) {
   res.render('signup.ejs');
});

app.get('/landing', function(req, res) {
   res.render('landing.ejs');
});

app.get('/notfound', function(req, res) {
   res.render('notfound.ejs');
});


app.get('/confirmType', (req,res) => {
    if(req.user) {
        if(req.user.type != 'false') {
            res.redirect('/');
        }else {
            res.render('confirmType.ejs');
        }
    } else {
        res.redirect('/')
    }
})

app.get('/dashboard', (req,res) => {
    if(req.user) {
        if(req.user.type!='false') {
            if(req.user.type == 'uploader') {
                res.redirect('/uploaderDashboard');
            }else {
                res.redirect('/bidderDashboard');
            }
        }else {
            res.redirect('/confirmType');
        }
    } else {
        res.redirect('/');
    }
});

app.get('/uploaderDashboard', (req,res) => {
    if(req.user) {
        if(req.user.type != 'false') {
            if(req.user.type == 'uploader') {
                res.render('uploaderDashboard.ejs');
            } else {
                res.redirect('/dashboard');
            }
        } else {
            res.redirect('/confirmType');
        }
    } else {
        res.redirect('/');
    }
});

app.get('/bidderDashboard', (req,res) => {
    if(req.user) {
        if(req.user.type != 'false') {
            if(req.user.type == 'bidder') {
                res.render('bidderDashboard.ejs');
            } else {
                res.redirect('/dashboard');
            }
        } else {
            res.redirect('/confirmType');
        }
    } else {
        res.redirect('/');
    }
});

app.get('/createUploader', (req,res) => {
    User.findOne({username: req.query.username}, (err, user) => {
        if(user.type=='false') {
            user.type = 'uploader';
            user.save();
        }
    });
    res.redirect('/');
});

app.get('/createBidder', (req,res) => {
    User.findOne({username: req.query.username}, (err, user) => {
        console.log(user.username);
        if(user.type=='false') {
            user.type = 'bidder';
            user.save();
        }
    });
    res.redirect('/');
});

//AUTHENTICATION
app.post("/signupgovernmentofficial",function(req,res){

    var username=req.body.username;
    var password=req.body.password;
    var contactnumber=req.body.contactnumber;
    var region=req.body.region;
    var governmentidnumber=req.body.governmentidnumber;
    var newOfficer=new User({username: username, type:'false', contactnumber:contactnumber, region:region, governmentidnumber:governmentidnumber});
    User.register(newOfficer,password,function(err,user){
        if(err){
            console.log(err);
            return res.redirect("/");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
});

app.post("/signupbidder",function(req,res){

    var username=req.body.username;
    var password=req.body.password;
    var contactnumber=req.body.contactnumber;
    var region=req.body.region;
    var registerationnumber=req.body.registerationnumber;
    var dateofbirth=req.body.dateofbirth;
    var companyname=req.body.companyname;
    var biddertype=req.body.biddertype;
    var pannumber=req.body.pannumber;



    var newBidder=new User({username: username, type:'false', contactnumber:contactnumber, region:region, registerationnumber:registerationnumber, dateofbirth:dateofbirth, biddertype:biddertype, pannumber:pannumber});
    User.register(newBidder,password,function(err,user){
        if(err){
            console.log(err);
            return res.redirect("/");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
});

//USER LOG IN
app.post("/signin",passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/notfound"
}),function(req,res){

});

//USER LOG OUT
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/authenticate");
});

app.listen(3000, () => {
    console.log('Server started at 3000');
});
