"use strict";
import Model from '../models';
import moment from 'moment';
import marked from 'marked';

let ObjectId = require('mongodb').ObjectID;
let UserModel = Model.User;
let aritcleModel = Model.Article;
let CommentModel = Model.Comment;
let CollectionModel = Model.Collection;

module.exports.publish = async(ctx, next) => {
	await ctx.render('publish',{
		session: ctx.session || null
	});
}

module.exports.post = async(ctx, next) => {
	let body = ctx.request.body;
	if(body.topic_id){
		let id = new ObjectId(body.topic_id);
		let article = {
			userId: ctx.session.user.dingId,
			userName: ctx.session.user.name,
			title: body.title,
			content:body.content,
			tag: body.tag,
			great: body.great,
			top: body.top
		}
		await aritcleModel.update({
			_id: body.topic_id
		}, article).then(function(){
			ctx.redirect('/article');
		});
	}else{
		let article = {
			userId: ctx.session.user.dingId,
			userName: ctx.session.user.name,
			title: body.title,
			content:body.content,
			tag: body.tag,
			create_at: new Date().getTime(),
			great: body.great,
			top: body.top
		}
		await aritcleModel.create(article).then(function(){
			ctx.redirect('/article');
		});
	}
}

module.exports.getOne = async(ctx, next) => {
	let id = new ObjectId(ctx.params.id);
	let article = await aritcleModel.findOne({
		_id: id
	}).exec();

	article.create_at = moment(new Date(parseInt(article.create_at,10))).fromNow();
	article.content = marked(article.content);

	let user = await UserModel.findOne({
		userId: article.userId
	}).exec();

	//更新pv
	await aritcleModel.update({
		_id: id
	},{$inc:{pv:1}});

	let comments = await CommentModel.find({
		topicId: ctx.params.id,
	}).sort({
		create_at: -1	
	}).exec();

	for(let i of comments){
		i.create_at = moment(new Date(parseInt(i.create_at,10))).fromNow();
	}

	await ctx.render('topic',{
		article: article,
		user:user,
		session: ctx.session || null,
		comments: comments
	});
}

module.exports.edit = async(ctx, next) => {
	let id = new ObjectId(ctx.params.id);
	let article = await aritcleModel.findOne({
		_id: id
	}).exec();

	article.create_at = moment(new Date(parseInt(article.create_at,10))).fromNow();

	let user = await UserModel.findOne({
		userId: article.userId
	}).exec();

	await ctx.render('edit',{
		article: article,
		user:user,
		session: ctx.session || null
	});
}

module.exports.list = async(ctx, next) =>{
	let article = await aritcleModel.find().sort({
		create_at: -1
	}).exec();

	for(let i of article){
		let html = marked(i.content);
	    html = html.replace(/<.+?>/ig, "");
	    html = html.replace("\r\n", "");
	    html = html.replace(" ", "");
 
		i.content = html.substring(0, 200) + '...';
		i.create_at = moment(new Date(parseInt(i.create_at,10))).fromNow();
	}

	await ctx.render('article_list',{
		article: article,
		session: ctx.session || null
	});
}

module.exports.collection = async(ctx, next) =>{
	let collection = await CollectionModel.findOne({
		userId: ctx.session.user.dingId,
		topicId: ctx.request.body.id
	}).exec();

	if(collection == null){
		await CollectionModel.create({
			userName: ctx.session.user.name,
			userId: ctx.session.user.dingId,
			topicId: ctx.request.body.id
		}).then(function(){
				ctx.body = {
					status: 200,
					msg:'收藏成功'
				}
		});
	}else{
		ctx.body = {
			status: 201,
			msg:'您己经收藏过该篇文章'
		}
	}
}



