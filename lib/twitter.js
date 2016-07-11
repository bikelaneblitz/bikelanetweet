const Twit = require('twit');
const Rx = require('rx');
const lwip = require('lwip');

function tweetRemoteImg( config, content){

};

function tweetLocalImg( config, content ){
	var lopen = Rx.Observable.fromNodeCallback( lwip.open );

	return lopen( content.photo ).flatMap( img => {
		return Rx.Observable.create(function(obser){
			img.toBuffer( 'jpg', {quality : 60 }, (err,buf) => {
				obser.onNext(buf.toString('base64'))
			});
		});
	}).flatMap( img_b64 => tweet( config, content, img_b64) );
};

function tweet( config, content, img_b64 ){
	var T = new Twit( config );

	return Rx.Observable.create(function(obser){
		T.post('media/upload', { media_data: img_b64 }, (err, data) => {
			obser.onNext(data);
		})
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
	});
};

module.exports = {
	tweetLocalImg,
	tweet
};
