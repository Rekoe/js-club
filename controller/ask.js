"use strict";

module.exports.list = async(ctx, next) => {
	await ctx.render('ask',{
		session: ctx.session || null
	});
}