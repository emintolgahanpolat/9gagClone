const express=require('express');
const router=express.Router();
const ctrlApp=require('../controller/ctrlApp')

const multer = require('multer');
const path = require('path');


const upload = multer(
    {
        storage: multer.diskStorage({
            destination:function (req, file, cb) {
            // set uploads directory
            cb(null, 'photo/post/')
            },
            filename: function(req, file, cb)  {
            // save file with current timestamp + user email + file extension
            cb(null, Date.now() + path.extname(file.originalname));
            }
        })
    }
    );
const uploadProfilePic = multer({storage: multer.diskStorage({
        destination:function (req, file, cb) {
            // set uploads directory
            cb(null, 'photo/user/')
        },
        filename: function(req, file, cb)  {
            // save file with current timestamp + user email + file extension
            cb(null, req.user._id+ path.extname(file.originalname));
        }
    })});


router.get('/settings',isLoggedIn,ctrlApp.settings);
router.post('/settings/profile',isLoggedIn,uploadProfilePic.single('photo'),ctrlApp.profileSettings);
router.post('/settings/password',isLoggedIn,ctrlApp.passwordSettings);
router.post('/settings/account',isLoggedIn,ctrlApp.accountSettings);
router.get('/settings/delete',isLoggedIn,ctrlApp.userBlock);

router.get('/u/:id',ctrlApp.user);
router.get('/u/:id/posts',ctrlApp.userPosts);
router.get('/u/:id/likes',ctrlApp.userUpVotes);
router.get('/u/:id/comments',ctrlApp.userComments);




router.get('/',ctrlApp.home);
router.get('/hot',ctrlApp.hot);
router.get('/trending',ctrlApp.trending);
router.get('/fresh',ctrlApp.fresh);



router.get('/gag/:id',ctrlApp.gag);
router.get('/aftergag/:id',ctrlApp.afterGag);
router.post('/report/:id',ctrlApp.report);
router.post('/postImgUrl',isLoggedIn, upload.single('photo'),ctrlApp.post);




router.get('/tag/:tag',ctrlApp.tag);
router.get('/search/:searchText',ctrlApp.searchTag);

router.get('/upVote/:id',ctrlApp.upVote);
router.get('/downVote/:id',ctrlApp.downVote);


router.get('/:data',ctrlApp.section);

module.exports=router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}