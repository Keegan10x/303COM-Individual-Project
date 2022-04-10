const mysql = require('mysql');
const fetch = require('node-fetch');


const pool  = mysql.createPool({
    host: 'database-2.c12mvwbpeqcr.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'p455w0rd',
    database: 'moduleSurveys',
    port: 3306,
});

exports.handler =  (event, context, callback) => {

  //const token = event.headers.authorization
  
  context.callbackWaitsForEmptyEventLoop = false;
  
  pool.getConnection((error, connection) => {
    // Use the connection
    connection.query('SELECT * FROM surveys', (error, results, fields) => {
      
      if (error) callback(error);
      
        //if(token == undefined || null){
          results.map( survey => { survey.href = `https://42559ljglh.execute-api.us-east-1.amazonaws.com/surveys/${survey.id}` })
  
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(results),
            headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://42559ljglh.execute-api.us-east-1.amazonaws.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Content-Type": "application/json"
            },
          })
        //}
    });
    connection.release();
  });
  
};