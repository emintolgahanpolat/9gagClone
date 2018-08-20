const express=require('express');
const router=express.Router();
const ctrlAdmin=require('../controller/ctrlAdmin')



router.get('/',ctrlAdmin.index);
router.get('/section',ctrlAdmin.section);
router.post('/section',ctrlAdmin.section);

router.get('/sectionEdit/:id',ctrlAdmin.sectionEdit);
router.post('/sectionEdit',ctrlAdmin.sectionEdit);

router.get('/user',ctrlAdmin.user);
router.get('/userBlock/:id',ctrlAdmin.userBlock);
router.get('/userDel/:id',ctrlAdmin.userDel);

router.get('/post',ctrlAdmin.post);
router.get('/postDel/:id',ctrlAdmin.postDel);

router.get('/reportPost',ctrlAdmin.reportPost);
router.get('/reportPostCancel/:id',ctrlAdmin.reportPostCancel);
router.get('/reportPostDel/:id',ctrlAdmin.reportPostDel);

router.get('/navbarLink',ctrlAdmin.navbarLink);
router.post('/navbarLink',ctrlAdmin.navbarLink);
router.get('/navbarLinkDel/:id',ctrlAdmin.navbarLinkDel);

router.get('/tag',ctrlAdmin.tag);
module.exports=router;
