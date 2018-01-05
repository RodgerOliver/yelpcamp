var mongoose = require("mongoose");
var campSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: Number,
	createdAt: {type: Date, default: Date.now},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
}, {usePushEach: true});
module.exports = mongoose.model("Camp", campSchema);