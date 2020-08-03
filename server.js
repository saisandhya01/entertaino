const express=require('express');
const mysql=require('mysql')
const session=require('express-session')
const bcrypt=require('bcrypt')
const flash=require('express-flash')
const bodyParser=require('body-parser');
const PORT=process.env.PORT || 3000;
const app=express();

const TWO_HOURS=1000*60*60*2;
const {
  NODE_ENV='development',
  SESS_NAME='name',
  SESS_SECRET='secret',
  SESS_LIFETIME=TWO_HOURS
} =process.env
const IN_PROD=NODE_ENV==='production';

//database connection
const db=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    database: 'ClientDetails'
  });
  db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('Mysql connected!');
  })


//middlewares
app.set('view engine','ejs');
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/javascript'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash())
app.use(session({
  name:SESS_NAME,
  resave:false,
  saveUninitialized:false,
  secret:SESS_SECRET,
  cookie:{
      maxAge:SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
  }
}))

function checkAuthenticated(req,res,next){
    if(!req.session.user){
        res.redirect('/login');
    }
    else{
        next();
    }
  }
  function checkNotAuthenticated(req,res,next){
    if(req.session.user){
        res.redirect('/home');
    }
    else{
        next();
    }
  }

  function checkForUsername(username){
    return new Promise((resolve,reject)=>{
      const sql="SELECT * FROM users WHERE username=?"
      db.query(sql,[username],(err,result)=>{
        if(err) return reject(err);
        if(result[0]){
          return resolve(username);
        }
        else{
          return resolve(null);
        }
      })
    })
  }
  
  
//routes

//get routes
app.get('/',(request,response)=>{
    response.render('welcome');
})
app.get('/register',(request,response)=>{
    response.render('register');
})
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
      const exists= await checkForUsername(req.body.username);
      if(!exists){
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        const user={
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword
        }
        const sql="INSERT INTO users SET ?"
        db.query(sql,user,(err,result)=>{
          if(err) throw err;
          res.redirect('/login')
        })
      }
      else{
        req.flash('exist','Username already exists! Try with a different username')
        res.redirect('/register');
      }
    }  catch(e){
      console.log(e);
      res.redirect('/register')
    }
  
    })
  
app.get('/login',checkNotAuthenticated,(request,response)=>{
    response.render('login');
})
app.post('/login',checkNotAuthenticated,(req,res)=>{
    try {
      const sql="SELECT * FROM users WHERE username=?"
          db.query(sql,[req.body.username],async (err,rows)=>{
              if(err) throw err;
              const user=rows[0];
              if(rows.length===0){
                  req.flash('error','No user with the given username found')
                  res.redirect('/login');
              }
              if(await bcrypt.compare(req.body.password,user.password)){
                  req.session.user=user;
                  res.redirect('/home');
              }
              else{
                  req.flash('error','Password incorrect!');
                  res.redirect('/login');       
                 }
          
          })
      
    } catch (error) {
      console.log(error);
      res.redirect('/login');
    }
  })
  
app.get('/home',checkAuthenticated,(request,response)=>{
    response.render('home',{name: request.session.user.name,username: request.session.user.username});
})
app.post('/logout',checkAuthenticated,(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/home');
        }
        res.clearCookie(SESS_NAME);
        res.redirect('/login');
    })
  })
app.get('/diary',checkAuthenticated,(request,response)=>{
    response.render('diary');
})
app.post('/note',checkAuthenticated,(req,res)=>{
  const noteDetails=req.body
  let dateFormat=new Date(noteDetails.date)
  const sql="SELECT * FROM diary WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err;
    console.log(result)
    if(result.length!==0){
      const sql1="UPDATE diary SET notes=? WHERE username=? AND date=?"
      db.query(sql1,[noteDetails.notes,req.session.user.username,dateFormat],(err,result1)=>{
        if(err) throw err
        console.log(result1)
      })
    }
    else{
      const diaryDetails={
        username:req.session.user.username,
        date:dateFormat,
        notes:noteDetails.notes
      }
      const sql1="INSERT INTO diary SET ?"
      db.query(sql1,diaryDetails,(err,result1)=>{
        if(err) throw err;
        console.log(result1)
      })
      
    }
  })
  res.end("done")
})
app.delete('/note',checkAuthenticated,(req,res)=>{
  let noteDetails=req.body
  let dateFormat=new Date(noteDetails.date)
  const sql="SELECT * FROM diary WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err
    if(result.length===0){
      res.end("no row found for deleting")
    }
    else{
      const sql2="DELETE FROM diary WHERE username=? AND date=?"
      db.query(sql2,[req.session.user.username,dateFormat],(err,result1)=>{
        if(err) throw err
        console.log(result1)
        res.end('successfully deleted')
      })
    }
  })
  
})

app.get('/note/:date',(req,res)=>{
  let newDate=req.params.date
  let dateFormat=new Date(newDate)
  const sql="SELECT * FROM diary WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err
    if(result.length===0){
      res.send('nil')
    }
    else{
      res.send(result[0].notes)
    }
  })
})

app.get('/planner',checkAuthenticated,(req,res)=>{
  res.render('planner')
})
app.post('/task',checkAuthenticated,(req,res)=>{
   const taskDetails=req.body
   let dateFormat=new Date(taskDetails.date)
   const sql="SELECT * FROM planner WHERE username=? AND date=?"
   db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
     if(err) throw err;
     console.log(result)
     if(result.length!==0){
       const sql1="UPDATE planner SET tasks=? WHERE username=? AND date=?"
       db.query(sql1,[taskDetails.tasks,req.session.user.username,dateFormat],(err,result1)=>{
         if(err) throw err
         console.log(result1)
       })
     }
     else{
       const plannerDetails={
         username:req.session.user.username,
         date:dateFormat,
         tasks:taskDetails.tasks
       }
       const sql1="INSERT INTO planner SET ?"
       db.query(sql1,plannerDetails,(err,result1)=>{
         if(err) throw err;
         console.log(result1)
       })
       
     }
   })
   res.end('done')
})
app.get('/task/:date',(req,res)=>{
  let newDate=req.params.date
  let dateFormat=new Date(newDate)
  const sql="SELECT * FROM planner WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err
    if(result.length===0){
      res.send('nil')
    }
    else{
      res.send(result[0].tasks)
    }
  })
})
app.get('/choose/game',(request,response)=>{
    response.render('chooseGame');
})
app.get('/game1',(request,response)=>{
    response.render('typingGame');
})
app.get('/game2',(request,response)=>{
    response.render('handGame');
})
app.get('/game3',(request,response)=>{
    response.render('fallOutGame');
})
app.get('/scoreboard',(request,response)=>{
    response.render('scoreboard')
})
//post routes
app.post('/score',(request,response)=>{
    const details=request.body;
    console.log(details);
    response.end('done');
})
app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
})
