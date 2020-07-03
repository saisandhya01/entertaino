const express=require('express');
const { request, response } = require('express');
const bodyParser=require('body-parser');
const PORT=process.env.PORT || 3000;
const app=express();

//middlewares
app.set('view engine','ejs');
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/client-js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//routes

//get routes
app.get('/',(request,response)=>{
    response.render('welcome');
})
app.get('/register',(request,response)=>{
    response.render('register');
})
app.get('/login',(request,response)=>{
    response.render('login');
})
app.get('/home',(request,response)=>{
    response.render('home');
})
app.get('/diary',(request,response)=>{
    response.render('diary');
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
//post routes
app.post('/score',(request,response)=>{
    const details=request.body;
    console.log(details);
    response.end('done');
})
app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
})
