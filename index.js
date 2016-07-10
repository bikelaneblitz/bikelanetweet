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
	if( data.type === 'Create' && data.tweet ){
		console.log('tweet it!');
		tweet( config, {photo:data.photo, msg:templates[data.complaint](data),comp_no:data.comp_no, flickr:data.flickr})
			.subscribe( data => { console.log("DONEDONE"); }, err => console.log("err"));
		flickr.upload(config, {photo:data.photo, msg:templates[data.complaint](data),comp_no:data.comp_no, flickr:data.flickr});
	} else if ( data.type === 'Update' ){
		console.log('update');
	}
});
