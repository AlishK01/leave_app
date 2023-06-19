const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const Employee = require('./schema');
const Admin = require('./aschema');
const Complaint = require ('./cshema')
const Leave = require('./leave.js');
const passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
let session = require("express-session");
const cookieParser = require("cookie-parser");
const alert = require('alert');
mongoose.connect('mongodb://127.0.0.1:27017/leave_app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let oneDay = 1000 * 60 * 60 * 24;
app.use(require("express-session")({
    secret: "secret",
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: false
}));





app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(Employee.authenticate()));
// passport.serializeUser(Employee.serializeUser(function (employee, cb) {
//     process.nextTick(function () {
//         return cb(null, {
//             id: employee.id,
//             username: employee.username
//         });
//     });
// }));
// passport.deserializeUser(Employee.deserializeUser());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser(function (admin, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: admin.id,
            username: admin.username
        });
    });
}));
passport.deserializeUser(Admin.deserializeUser());

app.get("/", async (req, res) => {
    res.redirect('index',);

});
app.set('view engine', 'ejs');

app.get('/register', async (req, res, next) => {
    // const user= await Employee.find();
    // // // console.log(user);
    // console.log("register")
    res.redirect('profile');
});
app.post('/register', upload.single('image'), async (req, res, next) => {
    const { filename } = req.file;
    Employee.register(new Employee({ ename: req.body.ename, username: req.body.username, image: filename, about: req.body.about, designation: req.body.designation, }), req.body.password, function (err, user) {

        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/index");

        });
    });
});

app.get("/login", async (req, res) => {
    // session=req.session;
    // res.render("profile");
    
});
app.post("/login", passport.authenticate("local", {

    failureRedirect: "/login"
}), async (req, res) => {
    try {
        const id = req.params.id;
        const { username, pass } = req.body;
        // const user = await User.findOne({ username });
        if(req.body.username == username && req.body.pass == pass){
          let  session=req.session;
            session.userid=req.body.username;
            const user = await Employee.findOne({ username });
            console.log(req.session)
            res.render('profile',{user});
         
        }
        else{
            alert("Invalid username or password");
        }

    } catch (error) {
        console.log(error);
        res.redirect('/error.html');
    }
   
});
app.get("/profile", isLoggedIn, async (req, res) => {
    const id = req.user.id;
    const user = await Employee.findOne({_id:id});
    res.render("profile",{user});
});


app.get('/index', async (req, res, next) => {
    const user = await Employee.find();
    console.log("my")
    // console.log(user);
    res.render('index', { user });
});
app.get('/aregister', async(req , res , next)=>{

})
app.post('/aregister', upload.single('image'), async (req, res, next) => {
    Admin.register(new Admin({ ename: req.body.ename, username: req.body.username,designation: req.body.designation, }), req.body.password, function (err, user) {

        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret");

        });
    });
});
app.get("/alogin", async (req, res) => {
    // session=req.session;
    // res.render("profile");
    
});
app.post("/alogin", passport.authenticate("local", {

    failureRedirect: "/alogin"
}), async (req, res) => {
    try {
        const id = req.params.id;
        const { username, pass } = req.body;
        // const user = await User.findOne({ username });
        if(req.body.username == username && req.body.pass == pass){
        //   let  session=req.session;
            // session.userid=req.body.username;
            const user1 = await Leave.find({});
            console.log(req.session)
            console.log(user1)
            res.render('admin',{user1});
         
        }
        else{
            alert("Invalid username or password");
        }

    } catch (error) {
        console.log(error);
        res.redirect('/error.html');
    }
   
});
app.get('/admin' , isLoggedIn, async(req, res)=>{

})
app.get("/leave/:id/approve", isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const user = await Leave.findOne({ _id: id });
        console.log(user)
        if (user) {
            const user1 = await user.deleteOne({})
            alert("Approved")
            res.redirect('/admin')

        } else {
            console.log("wrong")
            res.redirect('/error.html')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/error.html');
    }
});
app.get('/add', async (req, res, next) => {
    // const user= await Employee.find();
    // // // console.log(user);
    // console.log("register")
    res.redirect('/index');
});
app.post('/add', upload.single('image'), async (req, res, next) => {
    // const id = req.user.id;
    // console.log(id);
    const { username,department,joindate,complain} = req.body;

    const complaints = new Complaint({
        username,
        department,
        joindate,
        complain
       
    });

    await complaints.save();
    console.log("complaint")
    console.log(complaints);
    res.redirect('/mycomplaint')
});
app.get('/mycomplaint', async(req,res)=>{
    try {
        
        const user1 = await Complaint.find({ });
        console.log(user1)
        if (user1) {
            res.render('mycomplaint',{user1})

        } else {
            console.log("wrong")
            res.redirect('/error.html')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/error.html');
    }

});
// app.post('/mycomplaint', async(req,res)=>{
//     try {
        
//         const user1 = await Complaint.find({ });
//         console.log(user1)
//         if (user1) {
//             res.render('/mycomplaint',{user1})

//         } else {
//             console.log("wrong")
//             res.redirect('/error.html')
//         }
//     } catch (error) {
//         console.log(error);
//         res.redirect('/error.html');
//     }
// });

// app.get("/leave", async (req, res) => {
//     // session=req.session;
//     // res.render("profile");
    
// });

app.post('/leave', upload.single('image'),  async (req, res, next) => {
    const id = req.user.id;
    console.log(id);
    const { username, leave } = req.body;

    const leaves = new Leave({
        username,
        leave,
       
    });

    await leaves.save();
    console.log("leave")
    console.log(leaves);
    res.redirect('/pleave')

        });
app.get('/pleave', isLoggedIn, async(req,res)=>{
    try {
        const userna = req.user.username;
        console.log(userna)
        const user1 = await Leave.find({username:userna});
        console.log(user1);
        res.render('pleave', { user1});
    } catch (error) {
        console.log(error);
        res.send('Error retrieving user');
    }
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
// app.get("/logout", isLoggedIn, async (req, res) => {
//     req.logout(function (err) {
//         req.session.destroy();
//         if (err) { return next(err); }
//         res.render('index');
//     });
// });
app.get("/logout",isLoggedIn, async(req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.render('index');
      console.log("logged out");
    });
  });

// start the server
app.listen(8500, () => console.log('Server started on port 8500'));