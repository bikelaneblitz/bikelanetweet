var Twit = require('twit');
const Rx = require('rx');
const inquirer = require('inquirer');
const config = require('./.settings.json');
const fs = require('fs');

var prompts = new Rx.Subject();

const templates = {
	'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.complaint}`
};

const promptPromise = inquirer.prompt(prompts);
promptPromise.then(function(data){
	console.log( templWithRemaining(data) );
	var question = { name: 'tweet', type: 'confirm',  message: 'tweet?' };
	inquirer.prompt([question]).then(function(answers){
		console.log(answers);
		if( answers.tweet ){
			console.log('tweet it!');
			tweetIt({photo:data.photo, msg:templ(data)});
		}
	});
});
prompts.onNext( { name: 'type', type: 'list', message: 'choose complaint', choices: Object.keys(templates) } )
prompts.onNext( { name: 'photo', message: 'photo path:' });
prompts.onNext( { name: 'plate', message: 'plate #:'});
prompts.onNext( { name: 'complaint', message: 'complaint #:'} );

prompts.onCompleted();

const templ = function(data){
	return `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.complaint}`;
};

function templWithRemaining(data){
	var msg = templ(data);
	var remaining = `characters remaining:` + (140 - msg.length);
	return msg + '\n' + remaining;
};

/*


var T = new Twit( config );
inquirer.prompt([{ name: 'plate', message: 'plate #:'},
	{ name: 'complaint', message: 'complaint #:'}]).then(function(data){
		console.log( `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.complaint}` );
	});
*/

function tweetIt(content){
	console.log('tweetIt! start', content);
	var T = new Twit( config );
	var b64content = fs.readFileSync(content.photo.trim(), { encoding: 'base64' })

	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		var mediaIdStr = data.media_id_string;
		var meta_params = { media_id: mediaIdStr }

		T.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
				var params = { status: content.msg, media_ids: [mediaIdStr] }
				T.post('statuses/update', params, function (err, data, response) {
					console.log(data)
				});
			}
		});
	});
};
