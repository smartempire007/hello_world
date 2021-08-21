const { response } = require('express');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

const Users = [];

app.get('/signup', function(req, res){
   res.render('signup');
});

app.post('/signup', function(req, res){
   if(!req.body.id || !req.body.password){
      res.status('400');
      res.send("Invalid details!");
   }else {
      Users.filter(function(user){
         if(user.id === req.body.id){
            res.render('signup', {
               message: "User Already Exists! login or choose another user id"
            });
         }
      });
      const newUser = {id: req.body.id, password: req.body.password};
      Users.push(newUser);
      req.session.user = newUser;
      res.redirect('/protected_page');
   }
});

function checkSignIn(req, res){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}
app.get('/protected_page', checkSignIn, function(req, res){
   res.render('protected_page', {id: req.session.user.id})
});

app.get('/login', function(req, res){
   res.render('login');
});

app.post('/login', function(req, res){
   console.log(Users);
   if(!req.body.id || !req.body.password){
      res.render('login', {message: "Please enter both id and password"});
   } else {
      Users.filter(function(user){
         if(user.id === req.body.id && user.password === req.body.password){
            req.session.user = user;
            res.redirect('/protected_page');
         }
      });
      res.render('login', {message: "Invalid credentials!"});
   }
});

app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/login');
});

app.use('/protected_page', function(err, req, res, next){
console.log(err);
   //User should be authenticated! Redirect him to log in.
   res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));