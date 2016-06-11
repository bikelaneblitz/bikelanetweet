var Twit = require('twit');
const config = require('./.settings.json');

var T = new Twit( config );

T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
	console.log(data);
});

