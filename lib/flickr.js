const Flickr = require("flickrapi");

module.export = {
	'uplad' : function( config, content ){
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
	}
};
