var mongoose = require("mongoose");
var Camp = require("./models/camp");
var Comment = require("./models/comment");
var User = require("./models/user");

var data = [
	{
		name: "Cloud's Rest",
		image: "http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Bacon Camp",
		image: "http://www.cityofwashburn.org/uploads/7/0/4/7/70473445/8666847.jpg?464",
		description: "Sed do eiusmod tempor incididunt ut labore."
	},
	{
		name: "Dad is Stinky",
		image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
		description: "Et dolore magna aliqua. Ut enim ad minim veniam."
	},
	{
		name: "Parkour Camp",
		image: "https://res.cloudinary.com/simpleview/image/upload/crm/grandrapids/Indian-Valley-Campground_c7bc3284-5056-a36a-06f44499296d889d.jpg",
		description: "Parkour is the best sport EVEEEEERR!!"
	},
	{
		name: "123",
		image: "http://villageofgreenport.org/images/greenport-village-mccann-campgrounds.jpg",
		description: "This is the password for everything."
	},
	{
		name: "Secret Camp",
		image: "http://www.makeyourdayhere.com/ImageRepository/Document?documentID=51",
		description: "My campground is the most secret ever!! If you wnat to go the location is below ☺☻"
	},
	{
		name: "Active Camp",
		image: "http://www.ride2guide.com/CirclePinesKOA.jpg",
		description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Lorem Camp",
		image: "https://www.nps.gov/havo/planyourvisit/images/Namakanipaio_960.jpg",
		description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
	}
];

function seedDB() {
	User.remove({}, function (err, okay) {
		if(err) {
			console.log(err);
		} else {
			console.log("REMOVED ALL USERS");
			User.register({username: "Rodger"}, "rodger", function(err, rodger) {
				if(err) {
					console.log(err);
				} else {
					console.log("Rodger user created!");
				}
			});
			User.register({username: "Homer"}, "homer", function(err, rodger) {
				if(err) {
					console.log(err);
				} else {
					console.log("Homer user created!");
					// REMOVE ALL COMMENTS AND CAMPS
					Comment.remove({}, function(err, removedComments) {
						if(err) {
							console.log(err);
						} else {
							console.log("REMOVED ALL COMMENTS")
							Camp.remove({}, function(err) {
								if(err) {
									console.log(err);
								} else {
									console.log("REMOVED ALL CAMPS");
									// ADD SOME CAMPS
									data.forEach(function(seed) {
										Camp.create(seed, function(err, campground) {
											if(err) {
												console.log(err);
											} else {
												console.log("ADDED A CAMPGROUND");
												User.findOne({username: "Homer"}, function(err, user) {
													// CREATE A COMMENT FOR EACH CAMP
													Comment.create({
														text: "This place is great, but I wish there was internet",
														author: {
															id: user._id,
															username: user.username
														}
													}, function(err, comment) {
														if(err) {
															console.log(err);
														} else {
															campground.author.id = user._id;
															campground.author.username = user.username;
															campground.comments.push(comment);
															campground.save();
															console.log("CREATED A NEW COMMENT");
														}
													});
												});
											}
										});
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

module.exports = seedDB;