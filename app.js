//export express
var express 					= require("express"), //Express
	mongoose 					= require("mongoose"), //DB
	passport 					= require("passport"), //auth
	bodyParser 					= require("body-parser"),// get info from url
	LocalStraregy				= require("passport-local"), //auth
	passportLocalMongoose 	= require("passport-local-mongoose"); // auth

//require the user models
var User = require("./models/user");

//===========================SETUP=============================
//connet to a DB
mongoose.connect("mongodb://localhost:27017/auth_demo", { useNewUrlParser: true });

//to use express
var app = express();

//to use ejs
app.set('view engine', 'ejs');

//to get info from the url post methop
app.use(bodyParser.urlencoded({extended: true}));

//set Express session 
app.use(require("express-session")({
	secret: "thegrafico is my acount",
	resave: false,
	saveUninitialized: false
}));

//set passport para que express los use
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStraregy(User.authenticate()));

//para que encripte los datos y los envie y los desencripte
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//================== ============================================

//----------------------ROUTES----------------------------
//add firts route
app.get("/", function(req, res){
	res.render("home");
});

//aqui solo se puede entrar quienes esten login
app.get("/secret",isLoggedIn,function(req, res){
	console.log("HI");
	res.render("secret");
});

//	Auth routes
app.get("/register", function(req, res){
	res.render("register");
});

//handling user singUp
app.post("/register", function(req, res){
	//get the info from the Post request
	var usernameU = req.body.username;
	var passwordU = req.body.password;
	
	User.register(new User({username: usernameU}), passwordU, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			
			res.redirect("secret");
		});
	});
});

//Login routes
//render login form
app.get("/login", function(req, res){
	 res.render("login");
});

//midleware -- el 2do parametro corre primero que el callback
//authetificar los datos que submit en el app.get("/login")
app.post("/login", passport.authenticate("local",{
	successRedirect: "secret",
	failureRedirect: "login"
}),function(req, res){
});

//logout route
app.get("/logout", function(req, res){
	//destroy all sessions
	req.logout();
	console.log("Log Out");
	//redirect to home page
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	console.log(req.isAuthenticated());
	if(req.isAuthenticated()){
		return next();
	}
	console.log("Need to be Sing up");
	//dont need else because the return up
	res.redirect("/login");
}

//start the server
app.listen(3000, process.env.IP, function(){
	console.log("Server Up!");
});

