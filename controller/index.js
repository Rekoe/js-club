"use strict";
import request from 'request';
import curl from 'request-promise';
import Model from '../models';

let UserModel = Model.User;

module.exports.index = async(ctx, next) => {
	let name = ctx.query.name;
	if(name == null){
		await ctx.redirect('/article');
	}else{

		//获取token
		let token = null;
		await curl('https://oapi.dingtalk.com/gettoken?corpid=dingeadf6cbac824cd23&corpsecret=-y7SEPqQumpo62rw-YlMQ_wadBGiVjxuoDMjqPgZpN2WoMidQAUw0pqT0Dn76O10').then(function(res){
			token = JSON.parse(res).access_token;
		});

		//写入session
		ctx.session.user = {
			name: ctx.query.name,
			dingId: ctx.query.dingding,
			token:token
		}

		//获取前端部门id
		let id = null;
		await curl('https://oapi.dingtalk.com/department/list?access_token='+token).then(function(res){
			let arr = JSON.parse(res).department;
			for(let i of arr){
				if(i.name == '前端开发组'){
					id = i.id;
				}
			}

		});

		//获取当前登录用户的详细信息
		var user = null;
		await curl('https://oapi.dingtalk.com/user/list?access_token='+token+'&department_id='+id).then(function(res){
			var userList = JSON.parse(res).userlist;
			for(let i of userList){
				if(i.name == ctx.query.name){
					user = i;
				}
			}
		});

		//存取用户
		let userList = await UserModel.find().exec();
		if(userList.length < 1){
			await UserModel.create({
				userId: user.userid,
				name: user.name,
				avatar: user.avatar,
				workPlace: user.workPlace,
				orgEmail: user.orgEmail,
				mobile: user.mobile
			});
		}else{
			let isHaveUser = await UserModel.findOne({userId: user.userid}).exec();
			if(isHaveUser == null){
				await UserModel.create({
					userId: user.userid,
					name: user.name,
					avatar: user.avatar,
					workPlace: user.workPlace,
					orgEmail: user.orgEmail,
					mobile: user.mobile
				});
			}
		}
		
		await ctx.redirect('/article');
	}
};