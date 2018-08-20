var fs = require('fs');
var sectionModel = require('../model/section');
var postModel = require('../model/post');
var reportPostModel = require('../model/reportPost');
var userModel = require('../model/user');


module.exports.home = function (req, res) {


    postModel.aggregate([
        { "$project": { "tag":1 }},
        { "$unwind": "$tag" },
        { "$group": { "_id": "$tag", "count": { "$sum": 1 } }},
        { "$sort" : { "count" : -1} },
        { "$limit" : 3 }
    ]).exec(function (err, tags) {
        if(err) return res.status(404).send(err);

            postModel.find().sort( { createdAt: -1 } ).exec(function (err, results) {
                res.render('app/index', {layout: 'layout/layout', title: "", user: req.user,results:results,tags:tags});
            });

    });
}

module.exports.hot = function (req, res) {

    postModel.find().exec(function (err, results) {
        if(err) return res.status(404).send(err);
        res.render('app/index', {layout: 'layout/layout', title: "Hot", user: req.user,results:results});
    });
}

module.exports.trending = function (req, res) {

    postModel.find().exec(function (err, results) {
        if(err) return res.status(404).send(err);
        res.render('app/index', {layout: 'layout/layout', title: "Trending", user: req.user,results:results});
    });
}

module.exports.fresh = function (req, res) {

    postModel.find().sort( { createdAt: -1 } ).exec(function (err, results) {
        if(err) return res.status(404).send(err);
        res.render('app/index', {layout: 'layout/layout', title: "Fresh", user: req.user,results:results});
    });
}



module.exports.section = function (req, res) {
    var data=req.params.data.toLowerCase();
    sectionModel.findOne({title:data}).exec(function (err, section) {
        if(err) return res.status(404).send(err);
        if(section!=null) {
            postModel.find({sectionObject:section._id}).exec(function (err,results) {
                if(err) return res.render('error',{status:'404',message:'Sorry, I can not reach this section'});
                res.render('app/section', {layout: 'layout/layout', title: data, user: req.user,section:section,results:results});
            })
        }
        else{
            res.redirect('/');
        }

    });
}

module.exports.tag = function (req, res) {
    var tag=req.params.tag;
    console.log(tag)
    postModel.find({"tag":tag}).exec(function (err, results) {
        if(err) return res.status(404).send(err);
        res.render('app/tag', {layout: 'layout/layout', title: tag, user: req.user,results:results});
    });
}

module.exports.searchTag = function (req, res) {
    var searchText = req.params.searchText;
    //console.log("--> :" + searchText);
    postModel.aggregate([
        { "$project": { "tag":1 }},
        { "$unwind": "$tag" },
        { "$match" : { "tag" : {$regex: '.*' + searchText + '.*',} } },
        { "$group": { "_id": "$tag", "count": { "$sum": 1 } }},
        { "$sort" : { "count" : -1} }
    ]).exec(function (err, results) {
            if(!err){
                res.end(JSON.stringify(results));
            }
            else {
                res.end(JSON.stringify(null));
            }

    });

}

module.exports.gag = function (req, res) {
    var id=req.params.id;
    console.log(id)
    postModel.findOne({_id: id}).exec(function (err, results) {
        if(err) return res.render('error',{status:'404',message:'Sorry, I can not reach this gag '});

        res.render('app/gag', {layout: 'layout/layout', title: "Gag", user: req.user,results:results});
    });
}


module.exports.report = function (req, res) {
    var id=req.params.id;
    console.log(req.body)

    var reportObject = new reportPostModel({
        postObject: id,
        userObject: req.user._id ,
        report:req.body.report
    });

    reportObject.save(function (err) {
        if(err) return res.status(404).send(err);
        res.redirect('/gag/'+id);
    })


}

module.exports.afterGag = function (req, res) {
    var id=req.params.id;
    console.log(id)
    postModel.findOne({_id: {$gt: id}}).sort({_id: 1 }).limit(1).exec(function (err, results) {
        if(err) return res.status(404).send(err);

           if(results!=null){
               res.redirect('/gag/'+results._id);
           }
           else {
               res.redirect('/')
           }

    });
}
module.exports.upVote = function (req, res) {
    var id=req.params.id;

    postModel.update({_id:id},{$addToSet: {upVote:req.user._id}}).then(function (success) {
        postModel.update({_id:id},{$pull: {downVote:req.user._id}}).then(function (success) {
            res.end("success");
        }).catch(function (err) {res.status(404).send(err);});
    }).catch(function (err) {res.status(404).send(err);});

}

module.exports.downVote = function (req, res) {
    var id=req.params.id;
    postModel.update({_id:id},{$addToSet: {downVote:req.user._id}}).then(function (success) {
        postModel.update({_id:id},{$pull: {upVote:req.user._id}}).then(function (success) {
            res.end("success");
        }).catch(function (err) {res.status(404).send(err);});
    }).catch(function (err) {res.status(404).send(err);});
}


module.exports.user = function (req, res) {
    var reqUsername=req.params.id;
    console.log(reqUsername)
    userModel.findOne({username:reqUsername}).exec(function (err, x) {
        if(err) return res.status(404).send(err);
        postModel.find({userObject:x._id}).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            res.render('app/profile', {layout: 'layout/layout', title: "overview", user: req.user,profile:x,results:results});
        });
    });
}

module.exports.userPosts = function (req, res) {
    var reqUsername=req.params.id;
    userModel.findOne({username:reqUsername}).exec(function (err, x) {
        if(err) return res.status(404).send(err);
        postModel.find({userObject:x._id}).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            res.render('app/profile', {layout: 'layout/layout', title: "posts", user: req.user,profile:x,results:results});
        });
    });
}
module.exports.userUpVotes = function (req, res) {
    var reqUsername=req.params.id;
    userModel.findOne({username:reqUsername}).exec(function (err, x) {
        if(err) return res.status(404).send(err);
        postModel.find({upVote:x._id}).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            res.render('app/profile', {layout: 'layout/layout', title: "likes", user: req.user,profile:x,results:results});
        });
    });
}
module.exports.userComments = function (req, res) {
    var reqUsername=req.params.id;
    userModel.findOne({username:reqUsername}).exec(function (err, x) {
        if(err) return res.status(404).send(err);
        postModel.find({userObject:x._id}).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            res.render('app/profile', {layout: 'layout/layout', title: "comments", user: req.user,profile:x,results:results});
        });
    });
}


module.exports.settings = function (req, res) {
    res.render('app/settings',{layout:'layout/layout',title:"Settings",user : req.user});
}


module.exports.profileSettings = function (req, res) {
    var post = req.body;
    console.log(post)

    var userObject={
        name:post.name,
        country: post.country,
        birthday:post.date_year+'-'+(parseInt(post.date_mounth)+1)+'-'+post.date_day,
        about: post.about
    };

    (!req.file) ? false :userObject['imgUrl']="/user/"+req.file.filename;
    (post.gender=='M'||post.gender=='F'||post.gender=='X')? userObject['gender']=post.gender: false;

    console.log(userObject);
    userModel.findOneAndUpdate({_id:req.user._id},userObject).exec(function (err) {
           if(!err){
               res.redirect('/settings#profile')
           }
           else{
               res.render('app/settings',{layout:'layout/layout',title:"Settings",user : req.user,ErrorMsg: "Profile details not save"});
           }
        });

}

module.exports.passwordSettings = function (req, res) {
    var post = req.body;
    var userObject={};
    if(post.password==post.re_password){
        userObject['local.password']= userModel().generateHash(post.password);


        userModel.findOneAndUpdate(req.user._id,userObject).then(function (success) {
            res.redirect('/settings#password')
        }).catch(function (err) {
            res.render('app/settings',{layout:'layout/layout',title:"Settings",user : req.user,ErrorMsg: "Password not save"});

        });
    }else {
        res.render('app/settings',{layout:'layout/layout',title:"Settings",user : req.user,ErrorMsg: "Şifreler aynı değil, password not save"});

    }

}
module.exports.accountSettings = function (req, res) {
    var post = req.body;
    var userObject={};

    userObject['username']=post.username;
    userObject['email']=post.email;
    console.log(userObject);
    userModel.findOneAndUpdate(req.user._id,userObject).then(function (success) {
        res.redirect('/settings#account')
    }).catch(function (err) {
        res.render('app/settings',{layout:'layout/layout',title:"Settings",user : req.user,ErrorMsg: "Password not save"});

    });

}

const path = require('path');
const download = require('image-downloader')

function imgDownloader(uri) {
    var filename= +Date.now() +path.extname(uri);

    download.image({
        url: uri,
        dest:'photo/post/'+filename    // Save to /path/to/dest/image.jpg
    })
    return filename



}

module.exports.post = function (req, res) {
    var post = req.body;
    console.log(post.imgUrl);

    var imgUrl=!req.file ? '/post/'+imgDownloader(post.imgUrl): "/post/"+req.file.filename;


    var postObject = new postModel({
        descripe:post.dascribe,
        imgUrl:imgUrl,
        videoUrl:String,
        tag:post.tag.split(","),
        sectionObject:post.sectionId,
        userObject:req.user._id
    });


    postObject.save(function (err) {
        if (!err) {
            res.redirect('/')
        }
        else {
            res.render('app/index',{layout:'layout/layout',title:'Admin',user : req.user,ErrorMsg: "Post not save"});
        }
    })
}






module.exports.userBlock = function (req, res) {
    if (req.method === 'GET') {
        userModel.findById(req.user._id).exec(function (err, results) {
            if(results.block){ results.set({block:false});}
            else{ results.set({block:true});}

            results.save(function (err) {
                if(err) return res.status(404).send(err);
                res.redirect("/")
            });


        });
    }
}