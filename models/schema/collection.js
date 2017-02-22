import mongoose from 'mongoose';

let CollectionSchema = new mongoose.Schema({
	userName: String,
	userId: String,
	topicId: String
});

module.exports = CollectionSchema;