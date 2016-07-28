const Rx = require('rx');
const config = require('./.settings.json');
const fs = require('fs');

const questions = require("./lib/questions");
const templates = require("./lib/templates");
const tweet = require("./lib/twitter");
const flickr = require("./lib/flickr");

const update_templates = {
	'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`
};

questions().then(function(data){
	console.log(data);
	if( data.type === 'create' && data.tweet ){
		console.log('tweet it!');
		tweet.tweetLocalImg( config, {photo:data.photo, msg:templates['create'][data.complaint](data),comp_no:data.comp_no, flickr:data.flickr})
			.subscribe( data => { console.log("twitter post complete"); }, err => { console.log("twitter err"); console.log( err ); });
		flickr.upload(config, {photo:data.photo, msg:templates['create'][data.complaint](data),comp_no:data.comp_no, flickr:data.flickr})
			.subscribe( data => { console.log("flickr upload complete"); }, err => console.log("flickr err"));
	} else if ( data.type === 'update' ){
		console.log('update');
		flickr.search( config, data )
			.subscribe( data => { console.log("flickr search complete"); }, err => console.log("flickr err"));
	}
});
