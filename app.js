const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');



const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://127.0.0.1/authDemo');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const toDoRouter = require('./routes/todo');
const toDoAjaxRouter = require('./routes/todoAjax');

const Folder =require('./models/Folder')
const File=require('./models/File')
const Privilage=require('./models/Privilege')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);



app.get("/file/:id", isLoggedIn, async(req, res, next) =>{
  // i need to check if he is the owner or shared with to view 
     var id=req.params.id
      console.log("IDDD is" + id)
     const file=await File.findById(id);
     console.log("file content")
     console.log(file)
     var folder=file.path.split('/')[(file.path.split('/').length-1)];
     res.locals.file = file;
     res.locals.parent=file.parent;
     res.locals.folder=folder;
     res.render('filecontent2');//, { title: 'Express', path:file.path,filename:file.name,id:file._id, user: req.user,file:file,text:file.text});
  
});

app.get("/collabfile/:id", isLoggedIn, async(req, res, next) =>{
  // this is like the /editor/:id from the collabed app
  // we should have this just generate the editor.ejs from collabed ...
     var id=req.params.id
     console.log("COLLABFILE ---- IDDD is" + id)
     const file=await File.findById(id);
     console.log("file content")
     console.log(file)
     var folder=file.path.split('/')[(file.path.split('/').length-1)];
     res.locals.file = file;
     res.locals.parent=file.parent;
     res.locals.folder=folder;
     res.render('collabfile');//, { title: 'Express', path:file.path,filename:file.name,id:file._id, user: req.user,file:file,text:file.text});
  
});


app.get('/loadEditor/:room', (req,res,next) => {
  const room = req.params.room
  res.type('.js')
  console.log('in /loadEditor')
  console.dir(req.params)
  res.render('loadEditor',{ layout: 'no-layout', namespace:'/demo2', documentId:room })
})


const User = require('./models/User');



app.post("/share", isLoggedIn,
  async (req, res, next) => {
   var file=await File.findById(req.body.id);
   if (req.body.email.trim().length>0 && file.owner==req.user.googleemail)
    file.shared="Yes"
    await file.save();
    const privilage= new Privilage ({fileId:req.body.id, sharedwith:req.body.email, privilegetype:req.body.privilege})
    await privilage.save();
     res.redirect("/file/"+req.body.id);
   });

app.get('/shared', isLoggedIn, async(req, res, next) =>{
  const sharedfiles= await  Privilage.find( {sharedwith:req.user.googleemail})
  res.render('shared',{files:sharedfiles} );
});
app.post("/newItem", isLoggedIn,
  async (req, res, next) => {
    console.log("Hello people");
        console.log(req.body.type);
        console.log(req.body.fowner);
        console.log(req.body.fpath)

    console.log(req.body.type=="folder");
    if(req.body.type=="folder"){
      const folder = new Folder(
        {name:req.body.name,
         fcreatedAt: new Date(),
         fowner: req.body.fowner,
         fpath: req.body.fpath,
         parent:req.body.parent,
         shared:"No"
        });
      await folder.save();
    }
    else if(req.body.type=="file"){

      const file = new File(
        {name:req.body.name,
         createdAt: new Date(),
         owner: req.body.fowner,
         path: req.body.fpath,
         parent:req.body.parent,
         shared:"No",
         privilage:"edit"
        });
      await file.save();
    }
    if(req.body.parent==".")
    res.redirect('/');
  else res.redirect('/folders/'+req.body.parent)
    
                });

     
app.post("/savefile",
  isLoggedIn,
  async (req, res, next) => {
    // console.log(" I m saving now")
    console.log("inside savefile:")
    console.log(JSON.stringify(req.body));
    var file=await File.findById(req.body.id);
    file.text=req.body.text
    file.lastmodified=new Date();
    await file.save();
    console.log(JSON.stringify(file));
    res.redirect("/file/"+req.body.id);

        // console.log(" done saving now")


} );  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
