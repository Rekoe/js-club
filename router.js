"use strict";
import indexController from './controller/index';
import userController from './controller/user';
import articleController from './controller/article';
import askController from './controller/ask';
import commentController from './controller/comment';

module.exports = function(router){

	// 首页
	router.get('/', indexController.index);

	// 登录页
	router.get('/login', userController.login);

	// 登出
	router.get('/login_out', userController.loginOut);

	// profile
	router.get('/profile/:id', userController.profile);

	//发布文章
	router.get('/publish', articleController.publish);

	//提交文章
	router.post('/publish_article', articleController.post);

	//查看文章
	router.get('/topic/:id', articleController.getOne);

	//编辑文章
	router.get('/edit/:id', articleController.edit);

	//文章页
	router.get('/article', articleController.list);

	//问答
	router.get('/ask', askController.list);

	//评论
	router.post('/comment', commentController.post);

	//收藏文章
	router.post('/collection', articleController.collection);

	//加入关注
	router.post('/marked', userController.marked);

	//取消关注
	router.post('/channelMarked', userController.channelMarked);
}