const { faker, th } = require("@faker-js/faker");
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"/view")));
app.use(express.static(path.join(__dirname,"public")));
app.use("/style.css", express.static(path.join(__dirname, "/style.css")));
app.use("/style1.css", express.static(path.join(__dirname, "/style1.css")));


const connection = mysql.createConnection({
   host : 'localhost',
   user : 'root',
   database : 'delta_app',
   password : '9920',
});

let getRandomUser = () =>{
  return [
     faker.string.uuid(),
     faker.internet.username(), 
     faker.internet.email(),
     faker.internet.password(),
  ];
}

// let q = "insert into user (id,username,email,password) VALUES ?";

// let data = [];
// for (let i = 0; i < 100; i++){
//   data.push(getRandomUser());
// }

// try {
//      connection.query(q,[data],(err,result) =>{
//       if(err) throw err;
//       console.log(result);
      
//      })
// } catch (error) {
//     console.log("error");

// }


app.get("/",(req,res) =>{
  let q = "select count(*) AS total_user from user";
  try {
    connection.query(q,(err, result) =>{
      if(err) throw err;
      let count = result[0].total_user;
      res.render("home.ejs",{count});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

//show user 

app.get("/user",(req,res)=>{
  let q = `select * from user`;

  try {
    connection.query(q,(err,users)=>{
      if (err) throw err;
      res.render("showusers.ejs",{users});
    })

  } catch (error) {
    res.send("some error in database");
  }
});

//edit routs

app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `select * from user where id ='${id}'`
  
  try {
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs",{user});
    })
  } catch (error) {
    res.send("some error in DB");
  }
})

//update route

app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password:formPass, username : newUsername} = req.body;
  let q = `select * from user WHERE id = '${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];

      if(formPass != user.password){
          res.send("pasword is not matched");
      }else{
        let q2 = `UPDATE user SET username = '${newUsername}' where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        })
      }
    });
  }catch(err){
    console.log(err);
    res.send("some error in DB");
  }
});

//add the new user

app.get("/user/add",(req,res)=>{
  res.render("user.ejs");
})

app.post("/user/add",(req,res)=>{
  let {id,email,password,username} = req.body;

  let q = "INSERT INTO user (id,username,password,email) VALUES(?,?,?,?)";

  connection.query(q,[id,username,password,email],(err,result) =>{
    if(err) throw err
    res.redirect("/user");
  })
});

//delete 



app.delete("/user/:id",(req,res)=>{
  let {id} = req.params;

  let q = `DELETE FROM user WHERE  id = ?`;

  connection.query(q,[id],(err,result) =>{
    if(err) {
      throw err;
    }
    if(result.affectedRows > 0){
      res.redirect("/user");
    }else{
      res.send("user not found");
    }
  });
});

app.listen("8000",()=>{
  console.log("server is running on port 8000");
})





