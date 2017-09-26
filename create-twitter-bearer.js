/*** create-twitter-bearer-token.js ***/
var request = require('request');
var consumer_key = 'tr9NJzO4mWNNSiESyWV5Fx9v9';
var consumer_secret = 'KITzCEurIwVMGo526Q6JDMUfRZhHe4Z2EEs9yWqHrUOGTEAN5L';
var encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

var options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + encode_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: 'grant_type=client_credentials'
};

request.post(options, function(error, response, body) {
    console.log(body); // <<<< This is your BEARER TOKEN !!!
});
