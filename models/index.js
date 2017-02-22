"use strict";

import mongoose from 'mongoose';
import mongoSetting from '../config';
var db;

db = mongoSetting.mongo.connectURl;

mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
    if (err) {
        console.error('connect to %s error: ', db, err.message);
        process.exit(1);
    }
});

import UserListSchema from './schema/user';
import ArticleSchema from './schema/article';
import CommentSchema from './schema/comment';
import CollectionSchema from './schema/collection';
import MarkedSchema from './schema/marked.js';

var User = mongoose.model('User', UserListSchema);
var Article = mongoose.model('Article', ArticleSchema);
var Comment = mongoose.model('Comment', CommentSchema);
var Collection = mongoose.model('Collection', CommentSchema);
var Marked = mongoose.model('Marked', MarkedSchema);

module.exports = {
	User: User,
	Article: Article,
	Comment: Comment,
	Collection: Collection,
	Marked: Marked
}