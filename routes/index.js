var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middlewares");

// ROOT ROUTE
router.get("/", function(req, res) {
	res.render("landing");
});

// AUTH ROUTES
// register
router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.register(new User({username: username}), password, function(err, newUser) {
		if(err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to YelpCamp! Nice to meet you " + newUser.username);
			res.redirect("/camps");
		});
	});
});

// login
router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/camps",
	failureRedirect: "/login",
	successFlash: true,
	failureFlash: true
}));

// logout
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "You logged out!");
	res.redirect("/camps");
});

module.exports = router;