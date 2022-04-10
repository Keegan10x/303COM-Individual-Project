//ADD SURVEYS
const mysql = require('mysql');
const fetch = require('node-fetch');

//DB Credentials
const pool  = mysql.createPool({
    host: 'database-2.c12mvwbpeqcr.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'p455w0rd',
    database: 'moduleSurveys',
    port: 3306,
});

exports.handler = (event, context, callback) => {
  
  const token = event.headers.authorization
  
  const path = event.requestContext.path
  console.log(path)
  const surveyId = parseInt(path.slice(-1))

  
  if(token == undefined || null){
      callback(null, {statusCode:401, body:"No Authorization Header", headers: {'Content-Type': 'application/json'}})
  }else{
    
  fetch('https://42559ljglh.execute-api.us-east-1.amazonaws.com/accounts', {
      method: 'GET',
      headers: {
          "Authorization":token
      }
  })
  .then(res => res.json())
  .then(data => {
	// Do something...
	
	console.log(data.valid)
	if(data.valid===false){
	  callback(null, {
	    statusCode:401,
	    body:JSON.stringify({Message: "Not Authorized"}),
	    headers: {'Content-Type': 'application/json'}
	    })
	}else{
	
	//SQL Query
	context.callbackWaitsForEmptyEventLoop = false;
	pool.getConnection((error, connection) => {
	const sql = `SELECT * FROM questions WHERE survey=${surveyId}`
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if(error){
          console.log(error)
          callback(null, {
            statusCode: 400,
            body:JSON.stringify({Message: "Query Execution Failed"}),
            headers: {'Content-Type': 'application/json'}
          })
        }else{
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(results),
            headers: {'Content-Type': 'application/json'}
          })
        }
        
      });
	    
	  });
	
	
	}
  })
  .catch(err => console.log(err));
  }
  
  
};