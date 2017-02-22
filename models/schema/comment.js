import mongoose from 'mongoose';

let CommentSchema = new mongoose.Schema({
	topicId: String,
	topicTitle: String,
	userName: String,
	userId: String,
	avatar: String,
	create_at: String,
	comment: String
});

module.exports = CommentSchema;