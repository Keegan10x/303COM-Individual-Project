const mysql = require('mysql');
const bcrypt = require('bcrypt');
const util = require("./util.js");

const pool  = mysql.createPool({
    host: 'database-1.c12mvwbpeqcr.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'p455w0rd',
    database: 'authentication',
    port: 3306,
});


exports.handler =  (event, context, callback) => {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
  
  //const token = JSON.parse(event.body).authorization //get post body
  const token = event.headers.authorization //utilize auth 
  
  
  //const token = "Basic ZG9lajpwNDU1dzByZA=="
  const credentials = util.extractCredentials(token)
  //const credentials = extractCredentials(token)
  //console.log(credentials)
  
  pool.getConnection((error, connection) => {
    //verify username
    let sql = `SELECT * FROM accounts WHERE user="${credentials.user}";`;
    connection.query(sql, (error, results, fields) => {
      
      
      // Handle errors
      if(error) {
        connection.release();
        callback(error);
      }
      // If blank return false
      else if(!results[0]){ 
        connection.release();
        callback(null, {valid: false, id:null});
      }
      

      else{
      //verify password
      sql = `SELECT pass FROM accounts WHERE user = "${credentials.user}";`;
      connection.query(sql, (error, rslt, fields) => {
          
          // Handle errors
          if(error){
            connection.release();
            callback(error)
          };
          
          //compare password
          bcrypt.compare(credentials.pass, rslt[0].pass, (err, isAuth) => {
              connection.release();
              if(err){
                callback(null, {
	              statusCode: 401,
	              body: JSON.stringify({Message: "Unauthorized"}),
        	      headers: {'Content-Type': 'application/json'}
	            })
              } else callback(null, {
                valid: isAuth,
                id: results[0].id,
                username: results[0].user,
                headers: {'Content-Type': 'application/json'}
              })
          });
      }); 
      }  
    });
  });
  
  
};






