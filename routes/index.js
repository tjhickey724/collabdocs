var express = require('express');
var router = express.Router();

const Folder =require('../models/Folder')
const File =require('../models/File')
const authRouter = require('../routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
router.get('/', isLoggedIn, async(req, res, next) =>{
	
	const folders=  await Folder.find({fowner:req.user.googleemail,parent:"."});
	const files=await File.find({owner:req.user.googleemail,parent:"."});
    console.log(folders)
  res.render('index2', { title: 'Express', folders:folders,files:files, user: req.user, fpath:req.user.googlename, parent:"." ,oldparent:"", folder:req.user.googlename});
});

router.get('/folders/:id', isLoggedIn, async(req, res, next) =>{
	const thisFolder=await Folder.findById(req.params.id);
	const folders=  await Folder.find({fowner:req.user.googleemail, parent:req.params.id});
	const files=await File.find({owner:req.user.googleemail,parent:req.params.id});
	var folder=thisFolder.fpath.split('/')[(thisFolder.fpath.split('/').length-1)];
    console.log(req.params.id);
    console.log(thisFolder.parent)
    console.log(folders)
  res.render('index2', { title: 'Express', folders:folders,files:files, user: req.user, fpath:thisFolder.fpath+"/"+thisFolder.name, parent:req.params.id ,oldparent:thisFolder.parent, folder:folder});
});

module.exports = router;
