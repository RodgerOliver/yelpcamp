var express = require("express");
var router = express.Router({mergeParams: true}); // this object makes the params available here
var Camp = require("../models/camp");
var middleware = require("../middlewares"); // give a directory, it searchs for "index.js"
var Comment = require("../models/comment");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
	var id = req.params.id;
	Camp.findById(id, function(err, camp) {
		if(err || !camp) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/camps");
		} else {
			res.render("comments/new", {camp: camp});
		}
	});
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
	var id = req.params.id;
	var comment = req.body.comment;
	Camp.findById(id, function(err, camp) {
		if(err || !camp) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/camps");
		} else {
			Comment.create(comment, function(err, newComment) {
				if(err) {
					console.log(err);
					req.flash("error", "Failed to create your comment");
					res.redirect("/camps/" + id);
				} else {
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					camp.comments.push(newComment);
					camp.save(function(err, data) {
						if(err) {
							console.log(err);
							req.flash("error", "Failed to save your comment");
							res.redirect("/camps/" + id);
						} else {
							res.redirect("/camps/" + id);
						}
					});
				}
			});
		}
	});
});

// EDIT ROUTE
router.get("/:commentId/edit", middleware.checkUserComment, function(req, res) {
	Camp.findById(req.campId, function(err, camp) {
		if(err || !camp) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/camps");
		} else {
			res.render("comments/edit", {campId: req.campId, comment: req.commentById});
		}
	});
});

// UPDATE ROUTE
router.put("/:commentId", middleware.checkUserComment, function(req, res) {
	var campId = req.params.id;
	var commentId = req.params.commentId;
	var newComment = req.body.comment;
	Comment.findByIdAndUpdate(commentId, newComment, function(err, comment) {
		if(err || !comment) {
			console.log(err);
			req.flash("error", "Failed to update your comment, if it exists");
			res.redirect("back");
		} else {
			res.redirect("/camps/" + campId);
		}
	});
});

// DESTROY ROUTE
router.delete("/:commentId", middleware.checkUserComment, function(req, res) {
	var campId = req.params.id;
	var commentId = req.params.commentId;
	Comment.findByIdAndRemove(commentId, function(err) {
		if(err) {
			console.log(err);
			req.flash("error", "Failed to remove your comment");
			res.redirect("/camps");
		} else {
			req.flash("success", "Successfully deleted the comment");
			res.redirect("/camps/" + campId);
		}
	});
});

module.exports = router;