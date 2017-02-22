"use strict";
import Model from '../models';
import moment from 'moment';

moment.locale('zh-CN');

let UserModel = Model.User;
let ArticleModel = Model.Article;
let CollectionModel = Model.Collection;
let ObjectId = require('mongodb').ObjectID;
let CommentModel = Model.Comment;
let MarkedModel = Model.Marked;

module.exports.login = async(ctx, next) => {
	await ctx.render('login',{
		session: ctx.session || null
	});
}

module.exports.profile = async(ctx, next) => {
	let id = ctx.params.id;
	//用户信息
	let user = await UserModel.findOne({
		userId: id
	});

	//获取发布文章列表
	let articleList = await ArticleModel.find({
		userId: id
	}).sort({
		create_at: -1
	});

	for(let i of articleList){
		i.create_at = moment(new Date(parseInt(i.create_at,10))).fromNow();
	}
	
	//收藏文章
	let collection = await CollectionModel.find({
		userId: ctx.session.user.dingId
	});
	
	let collectionArticles = [];
	for(let x of collection){
		let id = x.topicId;
		let article = await ArticleModel.findOne({
			_id: new ObjectId(id)
		}).exec();
		article.create_at = moment(new Date(parseInt(article.create_at,10))).fromNow();
		collectionArticles.push(article);
	}

	// 发表过的评论
	let comments = await CommentModel.find({
		userId: ctx.session.user.dingId
	}).exec();

	for(let y of comments){
		y.create_at = moment(new Date(parseInt(y.create_at,10))).fromNow();
	}

	// 关注好友
	let marked = await MarkedModel.find({
		userId: ctx.session.user.dingId
	}).exec();

	await ctx.render('profile',{
		user: user,
		articleList: articleList,
		session: ctx.session || null,
		collection: collectionArticles,
		comments: comments,
		marked: marked
	});
}

module.exports.loginOut = async(ctx, next) => {
	ctx.session.user = null;
	await ctx.redirect('/');
}

module.exports.marked = async(ctx, next) => {
	let marked = await MarkedModel.findOne({
		userId: ctx.session.user.dingId,
		markedUserId: ctx.request.body.id
	}).exec();

	let markedObj = {};
	markedObj.userId = ctx.session.user.dingId;
	markedObj.name = ctx.session.user.name;

	let user = await UserModel.findOne({ userId: ctx.request.body.id}).exec();
	markedObj.markedUserName = user.name;
	markedObj.markedUserAvatar = user.avatar;
	markedObj.markedUserId = ctx.request.body.id;

	if(marked == null){
		await MarkedModel.create(markedObj).then(function(){
			ctx.body = {
				status: 200,
				msg:'关注成功'
			}
		});
	}else{
		ctx.body = {
			status: 201,
			msg:'您己经关注过该用户'
		}
	}
}

module.exports.channelMarked = async(ctx, next) => {
	var id = ctx.request.body.id;

	await MarkedModel.remove({
		userId: ctx.session.user.dingId,
		markedUserId: id
	}).then(function(){
		ctx.body = {
			status: 200
		}
	});
}







