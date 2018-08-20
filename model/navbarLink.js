const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var navbarLinkSchema=new Schema({
    title:{type: String, required: true},
    url:{type: String, required: true},
    state:{type: Boolean, default: true}
})

var navbarLinkModel=mongoose.model('navbarLink',navbarLinkSchema);
module.exports=navbarLinkModel;

global.navbarLinkList;
navbarLinkModel.find().exec(function (err, results) {

    navbarLinkList=results;
});