const express = require("express");
let path = require("path");;
const app = express();
const PORT = 3001;
let JWT = require("./utils/JWT");

app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.set("views", path.resolve(__dirname, "views", "ejs"));
app.set("view engine", "ejs");


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

app.get("/datos", async (req,res,next)=>{
    if(!req.headers.authorization) return res.json({error: "No tienes acceso"})

    const token = req.headers.authorization.split(" ")[1];
    let infoToken = await JWT.verify(token);
    let user = users.find(usuario => usuario.username == infoToken.username);
    res.json(user);
    // res.render("datos", { usuario: req.session.user});
});

app.get("/error", (req,res,next)=>{
    res.render("error", { error: "Un Mensaje de error"});
});

app.get("/registro", (req,res,next)=>{
    res.render("signup", {});
});

app.post("/login", async (req,res,next)=>{
    let { username, password } = req.query;
    console.log(users, username);
    let user = users.find(usuario => usuario.username == username);
    console.log(user);
    let token = await JWT.generate({username: user.username});
    res.json({token})
})

app.post("/registro", async (req,res,next)=>{
    let { username, password, direccion } = req.query;
    let user = users.find(usuario => usuario.username == username);
    if(user) res.json({error: "El usuario ya existe"});
    users.push({
        username,
        password,
        direccion
    });

    let token = await JWT.generate({username});
    res.json({token});
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