const mysql=require('mysql')
const db=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    database: 'ClientDetails',
    charset: 'utf8mb4'
});
module.exports=db