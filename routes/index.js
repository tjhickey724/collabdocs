var express = require('express');
var router = express.Router();

const Folder =require('../models/Folder')
const File =require('../models/File')
const authRouter = require('../routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
router.get('/', isLoggedIn, async(req, res, next) =>{
	
	const folders=  await Folder.find({fowner:req.user.googleemail});
	const files=await File.find({owner:req.user.googleemail});
    console.log(folders)
  res.render('index2', { title: 'Express', folders:folders,files:files, user: req.user });
});



module.exports = router;
