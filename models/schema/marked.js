import mongoose from 'mongoose';

let MarkedSchema = new mongoose.Schema({
	userId: String,
	name: String,
	markedUserId: String,
	markedUserName: String,
	markedUserAvatar: String
});

module.exports = MarkedSchema;