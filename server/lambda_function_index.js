const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  let body;
  let statusCode = 200;
  const headers = {
	"Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };

  try {
	switch (event.httpMethod) {
  	case "DELETE":
    	await dynamo
      	.delete({
        	TableName: "patient_registers",
        	Key: {
          	id: event.pathParameters.id
        	}
      	})
      	.promise();
    	body = `Deleted patient ${event.pathParameters.id}`;
    	break;
  	case "GET":
  	    if (event.pathParameters != null){
    	body = await dynamo
      	.get({
        	TableName: "patient_registers",
        	Key: {
          	id: event.pathParameters.id
        	}
      	})
      	.promise();
  	    } else{
  	        body = await dynamo.scan({
  	            TableName: "patient_registers"
  	        }).promise();
  	    }
    	break;
    	
  	case "POST":
    	let requestJSON = JSON.parse(event.body);
    	await dynamo
      	.put({
        	TableName: "patient_registers",
        	Item: {
          	id: requestJSON.id,
          	PatientName: requestJSON.name,
          	PatientEmail: requestJSON.email,
          	PatientBD: requestJSON.birthday,
          	PatientAddress: requestJSON.address,
        	}
      	})
      	.promise();
    	body = `Put item ${requestJSON.id}`;
    	break;
  	default:
    	throw new Error(`Unsupported route: "${event.httpMethod}"`);
	}
  } catch (err) {
	statusCode = 400;
	body = err.message;
  } finally {
	body = JSON.stringify(body);
  }

  return {
	statusCode,
	body,
	headers
  };
};



