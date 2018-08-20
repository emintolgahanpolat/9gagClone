const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var reportPostSchema=new Schema({
    postObject: [{type: Schema.Types.ObjectId, ref: 'post'}],
    userObject: [{type: Schema.Types.ObjectId, ref: 'user'}],
    report:{type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

var reportModel=mongoose.model('reportPost',reportPostSchema);
module.exports=reportModel;
