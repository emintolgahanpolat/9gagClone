const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var commentSchema=new Schema({
    comment:{type:String,required:true},
    created: { type: Date, default: Date.now },
    is_removed: {type:Boolean, default:false },
    userObject: [{type: Schema.Types.ObjectId, ref: 'user'}],
    bookObject: [{type: Schema.Types.ObjectId, ref: 'book'}]
})

var commentModel=mongoose.model('comment',commentSchema);
module.exports=commentModel;
