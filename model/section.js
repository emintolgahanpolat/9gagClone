const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var sectionSchema=new Schema({
    title:{type: String, required: true},
    subTitle:{type: String, required: true},
    name:{type: String, required: true},
    icon:{type: String, required: true}
})

var sectionModel=mongoose.model('section',sectionSchema);
module.exports=sectionModel;


global.sectionList;
sectionModel.find().exec(function (err, results) {
    //console.log(results)
    sectionList=results;
});