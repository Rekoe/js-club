"use strict";
import Model from '../models';
import moment from 'moment';

moment.locale('zh-CN');

let UserModel = Model.User;
let CommentModel = Model.Comment;
let ArticleModel = Model.Article;
let ObjectId = require('mongodb').ObjectID;

module.exports.post = async(ctx, next) => {
	let body = ctx.request.body;
	let comment = {
		topicId: body.topic_id,
		topicTitle: body.topic_title,
		userName: ctx.session.user.name,
		userId: ctx.session.user.dingId,
		create_at: new Date().getTime(),
		comment: body.comments
	}

	let user = await UserModel.findOne({
		userId: ctx.session.user.dingId
	}).exec();
	comment.avatar = user.avatar;

	//更新文章评论数
	let id = new ObjectId(body.topic_id);
	await ArticleModel.update({
		_id: id
	},{$inc:{feedback:1}});

	await CommentModel.create(comment).then(function(){
		ctx.redirect('/topic/'+body.topic_id);
	});
}