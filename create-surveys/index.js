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
  console.log(token)
  if(token == undefined || null){
      callback(null, {statusCode:401, body:"No Authorization Header"})
  }
  
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
	    }
	  )}
	const survey = JSON.parse(event.body)
	
	//SQL Query
	context.callbackWaitsForEmptyEventLoop = false;
	//const date = new Date().toISOString().split('T')[0];
	const now = new Date().toISOString()
	const date = now.slice(0,19).replace('T', ' ')
	
	pool.getConnection((error, connection) => {
    const sql = `INSERT INTO surveys(name, description, usr, created)\
VALUES("${survey.surveyName}", '${survey.surveyDescription}', ${data.id}, "${date}")`
    connection.query(sql, (error, results, fields) => {
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      if (error){
        console.log(error)
        callback(null, {
	      statusCode:400,
	      body:JSON.stringify({Message: "Query Execution Failed"}),
	      headers: {'Content-Type': 'application/json'}
	      })
      }else{
        //callback(null,results.pop())
        callback(null, {
	      statusCode: 200,
	      body: JSON.stringify(results),
	      headers: {'Content-Type': 'application/json'}
	      })
      }
    });
  });
	
  })
  .catch(err => console.log(err));
  
};