var	passportMongoose	= require("passport-local-mongoose"),
	Comment				= require("./models/comment"),
	expressSession		= require("express-session"),
	methodOverride		= require("method-override"),
	LocalStrategy		= require("passport-local"),
	Camp				= require("./models/camp"),
	User				= require("./models/user"),
	flash				= require("connect-flash"),
	bodyParser			= require("body-parser"),
	passport			= require("passport"),
	mongoose			= require("mongoose"),
	express				= require("express"),
	app					= express();

// Requering Routes
var campsRoutes		= require("./routes/camps"),
	commentsRoutes	= require("./routes/comments"),
	indexRoutes		= require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

// mongoose setup
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.Promise = global.Promise;
mongoose.connect(url, {useMongoClient: true});

// express session setup
app.use(expressSession({
	secret: "Parkour",
	resave: false,
	saveUninitialized: false
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// way to render this in each route
app.use(function(req, res, next) {
	res.locals.user = req.user; // "res.locals.USER" will be the name available in the template
	res.locals.flashError = req.flash("error");
	res.locals.flashSuccess = req.flash("success");
	next();
});

// Moment is available for use in all of your view files
app.locals.moment = require("moment"); 

// Using Routes
app.use(indexRoutes);
app.use("/camps", campsRoutes); // prefix "/camps" is added in front of every route
app.use("/camps/:id/comments", commentsRoutes);

var server = app.listen(process.env.PORT || 3000, process.env.IP, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Working on port " + port);
});