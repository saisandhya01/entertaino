//constants
const express=require('express');
const mysql=require('mysql')
const session=require('express-session')
const bcrypt=require('bcrypt')
const flash=require('express-flash')
const bodyParser=require('body-parser');
const multer=require('multer')
const path=require('path')

const PORT=process.env.PORT || 3000;
const app=express();
const THREE_HOURS=1000*60*60*3;
const {
  NODE_ENV='development',
  SESS_NAME='name',
  SESS_SECRET='secret',
  SESS_LIFETIME=THREE_HOURS
} =process.env
const IN_PROD=NODE_ENV==='production';

//database connection
const db=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    database: 'ClientDetails',
    charset: 'utf8mb4'
  });
  db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('Mysql connected!');
  })


//middlewares
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname+ '/favicon-files'));
app.use(express.static(__dirname + '/javascript'));
app.use(express.static(__dirname + '/css/fonts'));
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
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
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
        const userScore={
          username: req.body.username
        }
        const sql="INSERT INTO scores SET ?"
        db.query(sql,userScore,(err,result)=>{
          if(err) throw err
          console.log(result)
        })
        const sql1="INSERT INTO users SET ?"
        db.query(sql1,user,(err,result)=>{
          if(err) throw err;
          req.session.user=user
          res.redirect('/image-upload')
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
 const sql="SELECT image FROM users WHERE username=?"
 db.query(sql,[request.session.user.username],(err,result)=>{
   if(err) throw err
   console.log(result)
   if(result[0].image===null){
     response.render('home',{image:`/apple-touch-icon.png`,name:request.session.user.username})
   }
   else{
     response.render('home',{image:`/uploads/${result[0].image}`,name:request.session.user.username})
   }
 })
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
  const sql="SELECT * FROM diaries WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err;
    console.log(result)
    if(result.length!==0){
      const sql1="UPDATE diaries SET notes=? WHERE username=? AND date=?"
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
      const sql1="INSERT INTO diaries SET ?"
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
  const sql="SELECT * FROM diaries WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err
    if(result.length===0){
      res.end("no row found for deleting")
    }
    else{
      const sql2="DELETE FROM diaries WHERE username=? AND date=?"
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
  const sql="SELECT * FROM diaries WHERE username=? AND date=?"
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
   const sql="SELECT * FROM planners WHERE username=? AND date=?"
   db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
     if(err) throw err;
     console.log(result)
     if(result.length!==0){
       const sql1="UPDATE planners SET morning=?,afternoon=?,evening=? WHERE username=? AND date=?"
       db.query(sql1,[taskDetails.morning,taskDetails.afternoon,taskDetails.evening,req.session.user.username,dateFormat],(err,result1)=>{
         if(err) throw err
         console.log(result1)
       })
     }
     else{
       const plannerDetails={
         username:req.session.user.username,
         date:dateFormat,
         morning: taskDetails.morning,
         afternoon: taskDetails.afternoon,
         evening: taskDetails.evening
       }
       const sql1="INSERT INTO planners SET ?"
       db.query(sql1,plannerDetails,(err,result1)=>{
         if(err) throw err;
         console.log(result1)
       })
       
     }
   })
   res.end('done')
})
app.delete('/task',checkAuthenticated,(req,res)=>{
  let taskDetails=req.body
  let dateFormat=new Date(taskDetails.date)
  const sql="SELECT * FROM planners WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err
    if(result.length===0){
      res.end("no row found for deleting")
    }
    else{
      const sql2="DELETE FROM planners WHERE username=? AND date=?"
      db.query(sql2,[req.session.user.username,dateFormat],(err,result1)=>{
        if(err) throw err
        console.log(result1)
        res.end('successfully deleted')
      })
    }
  })
  
})

app.get('/task/:date',(req,res)=>{
  let newDate=req.params.date
  let dateFormat=new Date(newDate)
  const sql="SELECT * FROM planners WHERE username=? AND date=?"
  db.query(sql,[req.session.user.username,dateFormat],(err,result)=>{
    if(err) throw err
    if(result.length===0){
      res.send({})
    }
    else{
      res.send(result[0])
    }
  })
})
app.get('/choose/game',checkAuthenticated,(request,response)=>{
    response.render('chooseGame');
})
app.get('/game1',checkAuthenticated,(request,response)=>{
    response.render('typingGame');
})
app.get('/game2',checkAuthenticated,(request,response)=>{
    response.render('handGame');
})
app.get('/game3',checkAuthenticated,(request,response)=>{
    response.render('fallOutGame');
})
app.get('/scoreboard',checkAuthenticated,(request,response)=>{
    response.render('scoreboard')
})
app.get('/score/table',checkAuthenticated,(req,res)=>{
  const sql="SELECT username,(game1+game2+game3) AS scores FROM scores ORDER BY (game1+game2+game3) DESC"
  db.query(sql,(err,result)=>{
    if(err) throw err
    res.send(result)
  })
})
app.post('/score',checkAuthenticated,(request,response)=>{
    const scoreDetails=request.body;
    console.log(scoreDetails)
    const sql="UPDATE scores SET ??=??+? WHERE username=?"
    db.query(sql,[scoreDetails.name,scoreDetails.name,scoreDetails.score,request.session.user.username],(err,result)=>{
      if(err) throw err
      console.log(result)
    })
    response.end('done');
})
app.get('/name',checkAuthenticated,(req,res)=>{
  res.send(req.session.user.username)
})
app.get('/weather',checkAuthenticated,(req,res)=>{
  res.render('weather')
})
app.get('/image-upload',checkAuthenticated,(req,res)=>{
  res.render('image-upload')
})
app.post('/upload', checkAuthenticated,(req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('image-upload', {msg: err});
    } else {
      if(req.file == undefined){
        res.render('image-upload', {msg: 'Error: No File Selected!'});
      } else {
        const sql="UPDATE users SET image=? WHERE username=?"
        db.query(sql,[req.file.filename,req.session.user.username],(err,result)=>{
          if(err) throw err
          console.log(result)
          res.redirect('/home')
        })
      }
    }
  });
});

app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
})
