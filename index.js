const express = require("express");
const expressSession = require("express-session");
let path = require("path");
const SECRET_KEY_SESSION = "clase18135";
const app = express();
const PORT = 3001;

app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.set("views", path.resolve(__dirname, "views", "ejs"));
app.set("view engine", "ejs");

app.use(expressSession({
    secret: SECRET_KEY_SESSION,
    resave:false,
    saveUninitialized:false

}));

let users = [];

let isLogin = (req, res, next) =>{
    if(req.session.user){
        next();
    }else{
        res.redirect('error')
    }
}

app.get("/", (req,res,next)=>{
    res.render("login", {});
});

app.get("/datos", isLogin, (req,res,next)=>{
    res.render("datos", { usuario: req.session.user});
});

app.get("/error", (req,res,next)=>{
    res.render("error", { error: "Un Mensaje de error"});
});

app.get("/registro", (req,res,next)=>{
    res.render("signup", {});
});

app.post("/login", (req,res,next)=>{
    let { username, password } = req.body;
    console.log(users, username);
    let user = users.find(usuario => usuario.username == username);
    console.log(user);
    if(user){
        if(user.password == password){
            req.session.user = user;
            res.redirect('datos');
        }else{
            res.json({error:"Credenciales invalidas"});
        }
    }else{
        res.json({error:"El usuario no existe"});
    }
})

app.post("/registro", (req,res,next)=>{
    let { username, password, direccion } = req.body;
    let user = users.find(usuario => usuario.username == username);
    if(user) res.json({error: "El usuario ya existe"});
    users.push({
        username,
        password,
        direccion
    });

    req.session.user = {
        username,
        password,
        direccion
    }

    res.redirect("datos");
})


app.get("/logout", (req,res,next)=>{
    req.session.destroy( err =>{
        if(err) res.send(JSON.stringify(err));
        res.redirect("/");
    });
});



app.listen(PORT, err=>{
    console.log(`http://localhost:${PORT}`);
})