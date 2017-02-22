import mongoose from 'mongoose';

let UserListSchema = new mongoose.Schema({
	userId: String,
	name: String,
	avatar: String,
	workPlace: String,
	orgEmail: String,
	mobile: String
});

module.exports = UserListSchema;