const mysql = require("mysql");
const bcrypt = require('bcryptjs');
var db=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

exports.sign_up = (req,res) => {
    console.log(req.body);

   // const fname = req.body.f_name;
    //const lname = req.body.l_name;
    //const email = req.body.email;
    //const pwd = req.body.pwd;
    //const cpwd = req.body.c_pwd;


    const {email,pwd,cpwd} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results) => {

        if(error){
            console.log(error);
        }

        if(results.length > 0){
            return res.render('homePage',{
                message : 'email has been already used'
            })
        }else if(pwd !== cpwd ){
            return res.render('homePage',{
                message : 'password do not match'
            });
        }

        let hashedPassword = await  bcrypt.hash(pwd, 8);
        console.log(hashedPassword);
       // res.send("testing");

        db.query('INSERT INTO users SET ?', {email : email,password:hashedPassword}, (error,results) =>{
          if(error){
              console.log(error);
          }else{
            console.log(results);
            return res.render('homePage',{
                message : 'you have been registered successfully'
            });
          }

        })
    });

    //res.send("FORM SUBMITED");

}

exports.log_in=async (req,res)=>{
    
    try{

        const {logemail,logpwd} = req.body;
        if(!logemail || !logpwd){
           return res.status(400).render('homePage',{
               message : 'please provide email and password'
 
           });
       }
 
       db.query('SELECT * FROM users WHERE email = ?', [logemail],async (error,results) =>{
         module.exports.val=results.id
           console.log(results);
          if(!results || !(await bcrypt.compare(logpwd,results[0].password)))
          {
              res.render("homePage",{
                  message:"email not matched"
              })
           }
        //    else{
        //       const id = results[0].id;
        //       const token = jwt.sign({id},process.env.JWT_SECRET, {
        //           expiresIn : process.env.JWT_EXPIRES_IN
        //       });
        //       console.log("token is "+token);
 
        //       const cookieOption = {
        //           expires: new Date(
        //               Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        //           ),
        //           httpOnly : true
        //       }
        //       res.cookie('jwt',token,cookieOption);
        //      res.render("homePage",{
        //          message:"login Successfull"
        //      })
        //   }
       })
     //   db.query("SELECT *FROM users where email = ?",[email], async (error,results,fields)=>{
     //     console.log("query start")
     //     if(error)
     //     {
     //         console.log("error:",error)
     //         res.send({
     //             "code":400,
     //             "failed":"error occured"
     //         })
     //     }else{
     //         console.log("working");
     //         // console.log("val:",val);
 
     //         res.render('user_profile',{message:"working",items:results})
     //     }
     // })
     }catch(error){
       console.log(error);
     }
}
exports.user_profile=(req,res)=>{
    const{logemail}=req.body;
    global.useremail=logemail;
    db.query("SELECT *FROM users where email = ?",[logemail], async (error,results,fields)=>{
        console.log("query start")
        console.log(useremail)
        if(error)
        {
            console.log("error:",error)
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }
        else{
            res.render('user',{items:useremail})
            return
        }
    })
}