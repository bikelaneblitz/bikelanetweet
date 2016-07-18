const Flickr = require("flickrapi");
const Rx = require('rx');
//const fetch = require('node-fetch');
const http = require('http');

function upload( config, content ){
	return Rx.Observable.create(function(obser){
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
			if( error ){ obser.onError( error ) }

			Flickr.upload({ photos: uploadOptions }, flickrOptions, function(err, result) {
				if(err) {
					obser.onError(err);
				}
				obser.onNext(result);
			});
		});
	});
};

function flauth( config ){
	var flickrOptions = {
		api_key: config.flickr_key,
		secret: config.flickr_secret,
		user_id: config.flickr_userid,
		access_token: config.flickr_token,
		access_token_secret: config.flickr_token_secret,
		permissions: 'write',
		progress: false
	};

	return Rx.Observable.create(function(obser){
		Flickr.authenticate(flickrOptions, function(error, flickr) {
			if( error ){
				obser.onError( error );
			} else {
				obser.onNext( flickr );
			}
		});
	});
};

function search( config, content ){
	return Rx.Observable.create(function(obser){
		flauth( config ).subscribe( flickr => {
			console.log("content:", content);
			flickr.photos.search({
				user_id: flickr.options.user_id,
				text: content.comp_no
			}, function(err, result) {
				if( err ){
					console.log( err );
					obser.onError( err );
				} else {
					let total = parseInt(result.photos.total);
					if( total === 1 ){
						obser.onNext(result.photos.photo[0].id);
					} else {
						console.log( "err: total returned = " + total );
					}
				}
			});
		});
	});
};

function getUrlForPhoto( config, photo_id){
	return Rx.Observable.create(function(obser){
		flauth( config ).subscribe( flickr => {
			flickr.photos.getInfo({
				photo_id
			}, function( err, result){
				if( err ){
					console.log( err );
					obser.onError( err );
				} else {
					console.log( `https://farm${result.photo.farm}.staticflickr.com/${result.photo.server}/${result.photo.id}_${result.photo.originalsecret}_o.${result.photo.originalformat}` );
					obser.onNext( `http://farm${result.photo.farm}.staticflickr.com/${result.photo.server}/${result.photo.id}_${result.photo.originalsecret}_o.${result.photo.originalformat}` );
				}
			});
		});
	});
};

function getUrl( photo_url ){
	return Rx.Observable.create(function(obser){
		/*
		 failed attempts to load file into buffer. will hopefully return to this.
		let data = [];

		fetch( photo_url ).then(
			res => typeof res.blob
		).then( text => obser.onNext( text ) )
			var buf = new Buffer(0);
		http.get( photo_url, res => {
			res.setEncoding('binary');
			res.on('data', function(chunk) {
				buf = Buffer.concat([buf, Buffer.from(chunk)]);
				//data += chunk;
				//data.push(chunk);
			});
			res.on( 'end', function(){
				console.log(buf.toString('base64'));
				obser.onNext(buf); })
		});
*/
		var fs = require('fs');
		var file = fs.createWriteStream("temp.jpg");
		var request = http.get(photo_url, function(response) {
			response.on( 'end', () => obser.onNext( "temp.png" ) );
			response.pipe(file);
		});
	});
};

module.exports = {
	upload,
	search : function( config, content ){
		return Rx.Observable.create(function(obser){
			search( config, content ).flatMap( photo_id => getUrlForPhoto( config, photo_id) ).flatMap(getUrl).subscribe( photo_url => {
				obser.onNext( photo_url );
			});
		});
	}
};
