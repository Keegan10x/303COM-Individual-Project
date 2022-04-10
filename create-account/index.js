const mysql = require('mysql');
const bcrypt = require('bcrypt');

//DB Credentials
const pool  = mysql.createPool({
    host: 'database-1.c12mvwbpeqcr.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'p455w0rd',
    database: 'authentication',
    port: 3306,
});

exports.handler =  (event, context, callback) => {
  
  const data = JSON.parse(event.body)
  console.log(data)
  
  bcrypt.genSalt(10, (err, salt) => {
    console.log('SOMETHING WENT WRONG', err)
    //callback({statusCode:400, body:JSON.stringify(err)})
    bcrypt.hash(data.pass, salt, (err, hash) => {
        console.log('SOMETHING WENT WRONG', err);
        //callback({statusCode:400, body:JSON.stringify(err)})
        //Store HASH to DB
        
        //prevent timeout from waiting event loop
        context.callbackWaitsForEmptyEventLoop = false;
        
        pool.getConnection((error, connection) => {
            // Use the connection
            const sql = `INSERT INTO accounts(user, pass) VALUES("${data.user}", "${hash}")`
            connection.query(sql, (error, results, fields) => {
            // And done with the connection.
            connection.release();
            // Handle error after the release.
            //if(error) console.log('SOMETHING WENT WRONG', error);
            if(error) callback({statusCode:400, body:JSON.stringify(error)});
            else {
              callback(null, {
              statusCode: 200,
              body: JSON.stringify(results),
              headers: {'Content-Type': 'application/json'}
              });
            }
            });
        });
        
    });
    
  });
  

};