const express = require("express");
const expressSession = require("express-session");
let path = require("path");
let passport = require("passport");
let LocalPassport = require("passport-local").Strategy


const SECRET_KEY_SESSION = "clase18135";
const app = express();
const PORT = 3001;
let users = [];

app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.set("views", path.resolve(__dirname, "views", "ejs"));
app.set("view engine", "ejs");


passport.use("login", new LocalPassport((username, password, done)=>{
    let user = users.find(usuario => usuario.username == username);

    if(!user) return done(null, false);

    if(user.password != password) return done(null, false);

    return done(null, user);

}));


passport.use("register", new LocalPassport(
    {passReqToCallback:true},
    (req, username, password, done)=>{

    let { direccion } = req.body;

    let user = users.find(usuario => usuario.username == username);

    if(user) return done(null, false);
    
    let newUser = {
        username,
        password,
        direccion
    }
    users.push(newUser);

    return done(null, newUser);

}));


passport.serializeUser((user, done)=>{
    done(null, user.username);
})

passport.deserializeUser((username, done)=>{
    let user = users.find(usuario => usuario.username == username);
    done(null, user);
})


app.use(expressSession({
    secret: SECRET_KEY_SESSION,
    cookie:{
        httpOnly: false,
        secure: false,
        maxAge: 60000
    },
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session())


let isAuth = (req, res, next) =>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.render('error', { error: "No estas autenticado!"})
    }
}

let isNotAuth = (req, res, next) =>{
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('datos')
    }
}

app.get("/", isNotAuth, (req,res,next)=>{
    res.render("login", {});
});

app.get("/registro", isNotAuth, (req,res,next)=>{
    res.render("signup", {});
});

app.get("/error", isNotAuth,  (req,res,next)=>{
    res.render("error", { error: "Un Mensaje de error"});
});

// PASSPORT

app.post("/login", passport.authenticate("login", {successRedirect: "datos", failureRedirect: "error"}))

app.post("/registro", passport.authenticate("register", {successRedirect: "datos", failureRedirect: "/"}))



app.get("/datos", isAuth, (req,res,next)=>{
    console.log(req.user)
    res.render("datos", { usuario: req.user});
});








app.get("/logout", (req,res,next)=>{
    req.session.destroy( err =>{
        if(err) res.send(JSON.stringify(err));
        res.redirect("/");
    });
});



app.listen(PORT, err=>{
    console.log(`http://localhost:${PORT}`);
})