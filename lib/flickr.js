const Flickr = require("flickrapi");
const Rx = require('rx');
const fetch = require('node-fetch');

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
	console.log("flickr search");
	return Rx.Observable.create(function(obser){
		console.log("Rx.Observable.create search");
		flauth( config ).subscribe( flickr => {
			flickr.photos.search({
				user_id: flickr.options.user_id,
				text: "1272472621"
			}, function(err, result) {
				if( err ){
					console.log( err );
					obser.onError( err );
				} else {
					let total = parseInt(result.photos.total);
					if( total === 1 ){
						console.log( result.photos.photo[0].id);
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
	console.log( "getUrlForPhoto" );
	console.log( photo_id );
	return Rx.Observable.create(function(obser){
		flauth( config ).subscribe( flickr => {
			flickr.photos.getInfo({
				photo_id
			}, function( err, result){
				console.log('err');
				console.log( err );
				console.log( 'result' );
				console.log( result );
				console.log( `https://farm${result.photo.farm}.staticflickr.com/${result.photo.server}/${result.photo.id}_${result.photo.originalsecret}_o.${result.photo.originalformat}` );
				obser.onNext( `https://farm${result.photo.farm}.staticflickr.com/${result.photo.server}/${result.photo.id}_${result.photo.originalsecret}_o.${result.photo.originalformat}` );
			});
		});
	});
};

function getUrl( photo_url ){
	return Rx.Observable.create(function(obser){
		fetch( photo_url ).then( res => res.text() ).then( text => obser.onNext( text ) )
	});
};

module.exports = {
	upload,
	search : function( config, content ){
		return Rx.Observable.create(function(obser){
			search( config, content ).flatMap( photo_id => getUrlForPhoto( config, photo_id) ).flatMap(getUrl).subscribe( photo_url => { console.log(photo_url)
				//fetch( photo_url ).then( res => res.text() ).then( text => console.log( text ) )
			});
		});
	}
};
