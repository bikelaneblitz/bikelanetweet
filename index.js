const Twit = require('twit');
const Rx = require('rx');
const inquirer = require('inquirer');
const config = require('./.settings.json');
const fs = require('fs');
const lwip = require('lwip');
const Flickr = require("flickrapi");

const templates = {
	'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`
};

var questions = [
	{ name: 'complaint', type: 'list', message: 'choose complaint', choices: Object.keys(templates) },
	{ name: 'photo', message: 'photo path:', filter: str => str.trim() },
	{ name: 'plate', message: 'plate #:'},
	{ name: 'comp_no', message: 'complaint #:'},
	{ name: 'tweet', type: 'confirm', message: data => templWithRemaining(data)},
	{ name: 'flickr', message: 'flickr notes' }
];

var updateQuestions = [
	{ name: 'comp_no2', message: 'complaint #:'},
]

updateQuestions.forEach(item => item.when = function(answers){
	return answers.type == 'Update';
});

questions.forEach(item => item.when = function(answers){ return answers.type == 'Create'; });

var createOrUpdate = { name: 'type', type:'list', message: 'New or existing 311 complaint?', choices: [ 'Create', 'Update' ] };
questions.unshift(createOrUpdate);
questions.push(...updateQuestions);

inquirer.prompt(questions).then(function(data){
	console.log(data);
	if( data.tweet ){
		console.log('tweet it!');
	tweetIt({photo:data.photo, msg:templates[data.complaint](data),comp_no:data.comp_no, flickr:data.flickr});
	}
});


function createPrompt(){
	console.log('inside createPrompt');
	inquirer.prompt(questions).then(function(data){
		console.log(data);
		if( data.tweet ){
			console.log('tweet it!');
		tweetIt({photo:data.photo, msg:templates[data.complaint](data),complaint:data.complaint, flickr:data.flickr});
		}
	});
};

function templWithRemaining(data){
	var msg = templates[data.complaint](data);
	var remaining = `characters remaining:` + (140 - msg.length);
	return msg + '\n' + remaining + '\ntweet?';
};

function tweetIt(content){
	console.log('tweetIt! start', content);
	var T = new Twit( config );
	var lopen = Rx.Observable.fromNodeCallback( lwip.open );

	var flickrOptions = {
		api_key: config.flickr_key,
		secret: config.flickr_secret,
		user_id: config.flickr_userid,
		access_token: config.flickr_token,
		access_token_secret: config.flickr_token_secret,
		permissions: 'write',
		progress: false
	};

	var uploadOptions = [{
		title: content.comp_no,
		description: content.flickr,
		photo: content.photo,
		tags : [ "submitted" ]
	}];

	Flickr.authenticate(flickrOptions, function(error, flickr) {
		Flickr.upload({ photos: uploadOptions }, flickrOptions, function(err, result) {
			if(err) {
				console.log("FLCIKR ERR");
				console.error(err);
			}
			console.log("photos uploaded");
		});
	});


	lopen( content.photo ).flatMap( img => {
		return Rx.Observable.create(function(obser){
			img.toBuffer( 'jpg', {quality : 60 }, (err,buf) => {
				obser.onNext(buf.toString('base64'))
			});
		});
	}).flatMap( img_b64 => {
		return Rx.Observable.create(function(obser){
			T.post('media/upload', { media_data: img_b64 }, (err, data) => {
				obser.onNext(data);
			})
		});
	}).flatMap( data  => {
		return Rx.Observable.create(function(obser){
			T.post('media/metadata/create', { media_id : data.media_id_string }, function (err, createData, response) {
				if( err ){
					console.log( err );
				} else{
					obser.onNext(data);
				}
			});
		});
	}).flatMap( data  => {
		return Rx.Observable.create(function(obser){
			T.post('statuses/update', { status: content.msg, media_ids: [data.media_id_string] }, function (err, data, response) {
				obser.onNext(data);
			});
		});
	})
	.subscribe( data => { console.log("DONEDONE"); }, err => console.log("err"));
};
