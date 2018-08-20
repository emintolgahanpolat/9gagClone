var sectionModel = require('../model/section');
var userModel = require('../model/user');
var postModel = require('../model/post');
var reportPostModel = require('../model/reportPost');
var navbarLinkModel = require('../model/navbarLink');


module.exports.index = function (req, res) {
    var results={}
    Promise.all([
        userModel.countDocuments().exec(),
        postModel.countDocuments().exec(),
        postModel.distinct('tag').exec(),
        postModel.distinct('commentObject').exec(),
        reportPostModel.countDocuments().exec()

    ]).then(function(counts) {
        results['user']=counts[0];
        results['post']=counts[1];
        results['tag']=counts[2].length;
        results['comment']=counts[3].length;
        results['reportPost']=counts[4];
        console.log(results);
        res.render('admin/index',{layout:'admin/layout',title:'Admin',user : req.user,results:results});
    });


}


module.exports.section = function (req, res) {

    var page=req.query.page != undefined ? req.query.page-1 : 0;
    if (req.method === 'GET') {
        sectionModel.find().skip(page*10).limit(10).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            sectionModel.countDocuments().exec(function (err, count) {
                if(err) return res.status(404).send(err);
                res.render('admin/table/section',{layout:'admin/layout',title:'Admin',user : req.user,results:results,count:count,page:page});
            });
        });
    }
    else{
        var post = req.body;
        var title = post.title.toLowerCase();
        var subTitle = post.subTitle;
        var name = post.name;
        var icon = post.icon;

        var sectionObject = new sectionModel({
            title:title,
            subTitle:subTitle,
            name: name,
            icon: icon
        })
        sectionObject.save(function (err,results) {
            if (!err) {
                res.redirect('/admin/section')
            }
            else {
                var count=sectionModel.countDocuments().exec();
                res.render('admin/index',{layout:'admin/layout',title:'Admin',user : req.user,results:results,count:count,ErrorMsg: name+" not save"});
            }
        })
    }

}

module.exports.sectionEdit = function (req, res) {

    if (req.method === 'GET') {
        var id=req.params.id;
        sectionModel.findById(id).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            res.render('admin/edit/section',{layout:'admin/layout',title:'Admin',user : req.user,results:results});
        });
    }
    else{
        var post = req.body;
        var id=post.id;
        var title = post.title.toLowerCase();
        var subTitle = post.subTitle;
        var name = post.name;
        var icon = post.icon;


        sectionModel.findByIdAndUpdate(id, { $set:{title:title,subTitle:subTitle,name: name,icon: icon}}, { new: true },function (err,results) {
            if (!err) {
                sectionModel.find().exec(function (err, results) {
                    //console.log(results)
                    sectionList=results;
                });
                res.redirect('/admin/section')
            }
            else {
                var count=sectionModel.countDocuments().exec();
                res.render('admin/index',{layout:'admin/layout',title:'Admin',user : req.user,results:results,count:count,ErrorMsg: name+" not save"});
            }
            })

    }

}


module.exports.user = function (req, res) {

    var page=req.query.page != undefined ? req.query.page-1 : 0;

    if (req.method === 'GET') {
        userModel.find().skip(page*10).limit(10).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            userModel.countDocuments().exec(function (err, count) {
                if(err) return res.status(404).send(err);
                res.render('admin/table/user',{layout:'admin/layout',title:'Admin',user : req.user,results:results,count:count,page:page});
            });
        });
    }

}

module.exports.userBlock = function (req, res) {
    if (req.method === 'GET') {
        var id=req.params.id;
        console.log(id)
        userModel.findById(id).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            if(results.block){ results.set({block:false});}
            else{ results.set({block:true});}

            results.save(function (err, updatedTank) {
                if (err) return handleError(err);
                res.redirect("/admin/user")
            });


        });
    }
}
module.exports.userDel = function (req, res) {
    if (req.method === 'GET') {
        var id=req.params.id;
        console.log(id)
        userModel.findByIdAndRemove(id).exec(function (err) {
            if (err) return handleError(err);
            res.redirect("/admin/user")
        });
    }
}

module.exports.post = function (req, res) {

    var page=req.query.page != undefined ? req.query.page-1 : 0;

    if (req.method === 'GET') {
        postModel.find().populate('userObject').skip(page*10).limit(10).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            postModel.countDocuments().exec(function (err, count) {
                if(err) return res.status(404).send(err);
                res.render('admin/table/post',{layout:'admin/layout',title:'Post',user : req.user,results:results,count:count,page:page});
            });

        });
    }

}

module.exports.postDel=function (req,res) {
    if (req.method === 'GET') {
        var id=req.params.id;
        console.log(id)
        postModel.findByIdAndRemove(id).exec(function (err) {
            if (err) return handleError(err);
            res.redirect("/admin/post")
        });
    }

}

module.exports.reportPost = function (req, res) {

    var page=req.query.page != undefined ? req.query.page-1 : 0;

    if (req.method === 'GET') {
        reportPostModel.find().populate('userObject').populate({path:'postObject', populate: { path: 'userObject' }}).skip(page*10).limit(10).exec(function (err, results) {
            if(err) return res.status(404).send(err);
            reportPostModel.countDocuments().exec(function (err, count) {
                if(err) return res.status(404).send(err);
                res.render('admin/table/reportPost',{layout:'admin/layout',title:'Post',user : req.user,results:results,count:count,page:page});
            });

        });
    }

}
module.exports.reportPostCancel=function (req,res) {
    if (req.method === 'GET') {
        var id=req.params.id;
        console.log(id)
        reportPostModel.findByIdAndRemove(id).exec(function (err) {
            if(err) return res.status(404).send(err);
            res.redirect("/admin/reportPost")
        });
    }

}
module.exports.reportPostDel=function (req,res) {
    if (req.method === 'GET') {
        var id=req.params.id;
        console.log(id)
        reportPostModel.findByIdAndRemove(id).exec(function (err,reportPost) {
            if(err) return res.status(404).send(err);
            postModel.findByIdAndRemove(reportPost._id).exec(function (err) {
                if(err) return res.status(404).send(err);
                res.redirect("/admin/reportPost")
            });
        });
    }

}

module.exports.tag = function (req, res) {
    var page=req.query.page != undefined ? req.query.page-1 : 0;

    if (req.method === 'GET') {
        postModel.aggregate([
            { "$project": { "tag":1 }},
            { "$unwind": "$tag" },
            { "$group": { "_id": "$tag", "count": { "$sum": 1 } }},
            { "$sort" : { "count" : -1} },
            { "$skip" : page*10 },
            { "$limit" : 10 }
    ]).exec(function (err, results) {
            postModel.distinct('tag').exec(function (err, count) {
                if(err) return res.status(404).send(err);
                res.render('admin/table/tag',{layout:'admin/layout',title:'Tag',user : req.user,results:results,count:count.length,page:page});
            });
        });
    }

}



module.exports.navbarLink = function (req, res) {

    if (req.method === 'GET') {
        navbarLinkModel.find().exec(function (err, results) {
            if(err) return res.status(404).send(err);
            res.render('admin/table/navbarLink',{layout:'admin/layout',title:'Post',user : req.user,results:results});

        });
    }
    else{


        var post = req.body;
        console.log(post);



        var navbarLinkObject = new navbarLinkModel({
            title:post.title,
            url:post.url,
            state:post.state=='on'?true:false
        });


        navbarLinkObject.save(function (err,results) {
            if (!err) {
                navbarLinkModel.find().exec(function (err, results) {

                    navbarLinkList=results;
                });
                res.redirect('/admin/navbarLink')
            }
            else {
                res.render('admin/table/navbarLink',{layout:'layout/layout',title:'Admin',user : req.user,results:results,ErrorMsg: "Link not save"});
            }
        })
    }

}
module.exports.navbarLinkDel=function (req,res) {
    if (req.method === 'GET') {
        var id=req.params.id;
        console.log(id)
        navbarLinkModel.findByIdAndRemove(id).exec(function (err) {
            if(err) return res.status(404).send(err);
            navbarLinkModel.find().exec(function (err, results) {

                navbarLinkList=results;
            });
            res.redirect("/admin/navbarLink")
        });
    }

}




