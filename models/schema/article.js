import mongoose from 'mongoose';

let ArticleSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    fromUserId: { type: String, default: null },
    fromUserName: { type: String, default: null },
    title: String,
    content: String,
    top: { type: Number, default: 0 },
    create_at: { type: String },
    pv: { type: Number, default: 0 },
    great: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    feedback: { type: Number, default: 0 },
    tag: String
});

module.exports = ArticleSchema;
