const Flickr = require("flickrapi");
const Rx = require('rx');

module.exports = {
	'upload' : function( config, content ){
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
	}
};
