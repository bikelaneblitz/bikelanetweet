var Twit = require('twit');
const Rx = require('rx');
const inquirer = require('inquirer');
const config = require('./.settings.json');

var prompts = new Rx.Subject();

const templates = {
	'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.complaint}`
};

const promptPromise = inquirer.prompt(prompts);
promptPromise.then(function(data){ console.log( templ(data) ); });
prompts.onNext( { name: 'type', type: 'list', message: 'choose complaint', choices: Object.keys(templates) } )
prompts.onNext( { name: 'plate', message: 'plate #:'});
prompts.onNext( { name: 'complaint', message: 'complaint #:'} );

prompts.onCompleted();

const templ = function(data){
	var msg = `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.complaint}`;
	var remaining = `characters remaining:` + (140 - msg.length);
	return msg + '\n' + remaining;
};

/*
var T = new Twit( config );
nquirer.prompt([{ name: 'plate', message: 'plate #:'},
	{ name: 'complaint', message: 'complaint #:'}]).then(function(data){
		console.log( `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.complaint}` );
	});
*/
var T = new Twit( config );
/*

T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
	console.log(data);
});
*/
