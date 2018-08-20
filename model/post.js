const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var postSchema=new Schema({
    imgUrl:{type: String, required: true},
    videoUrl:{type: String, required: true},
    descripe:{type: String, required: true},
    upVote:[{type: Schema.Types.ObjectId, ref: 'user'}],
    downVote:[{type: Schema.Types.ObjectId, ref: 'user'}],
    tag:[String],
    createdAt: {type: Date, default: Date.now},
    sectionObject:[{type: Schema.Types.ObjectId, ref: 'section'}],
    userObject: [{type: Schema.Types.ObjectId, ref: 'user'}],
    commentObject:[{type: Schema.Types.ObjectId, ref: 'user'}],
})

var postModel=mongoose.model('post',postSchema);
module.exports=postModel;
