const express=require('express')
const app=express()
const router = express.Router();
const mysql=require('mysql')
const hbs=require("hbs")
require('dotenv').config();
//const port=process.env.PORT

app.listen(8080,()=>{
    console.log("server started at PORT 8080")
})

var db=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});
db.connect(function(err){
    if(err){
        throw err;
    }
    console.log("MYSQL Connected")
})

app.use(express.urlencoded({extended: false}));
app.use(express.json());
//app.use(cookieParser());
app.set('view engine','hbs')
app.use(express.static('./public'))

app.use("/",require('./routes/route'))
app.use("/auth",require('./routes/auth'))

app.get("/",function(req,res){
    res.send("hello world")
})
// app.get("/home",function(req,res){
//     res.render("homePage")
// })
