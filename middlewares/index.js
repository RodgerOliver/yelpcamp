var Camp = require("../models/camp");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You must login first");
	res.redirect("/login");
}

middlewareObj.checkUserCamp = function(req, res, next) {
	var id = req.params.id;
	Camp.findById(id, function(err, camp) {
		if(err || !camp) {
			console.log(err);
			req.flash("error", "Campground not found");
			return res.redirect("/camps");
		}
		if(req.user && req.user._id.equals(camp.author.id)) {
			req.campById = camp;
			return next();
		}
		req.flash("error", "You are not allowed to do that");
		res.redirect("/camps/" + id);
	});
}

middlewareObj.checkUserComment = function(req, res, next) {
	var campId = req.params.id;
	var commentId = req.params.commentId;
	Comment.findById(commentId, function(err, comment) {
		if(err || !comment) {
			console.log(err);
			req.flash("error", "Comment not found");
			return res.redirect("/camps");
		}
		if(req.user && req.user._id.equals(comment.author.id)) {
			req.campId = campId;
			req.commentById = comment;
			return next();
		}
		req.flash("error", "You are not allowed to do that");
		res.redirect("/camps/" + campId);
	});
}

module.exports = middlewareObj;