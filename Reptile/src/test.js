const request = require('request');
const MoneyStr = `"questionType":"commercial"`;
request.get("localhost:3000/user", (error, response, body) => {

    console.log(body)
})