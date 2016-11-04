const Twit = require('twit');
const Rx = require('rxjs');
const lwip = require('lwip');

function tweetRemoteImg( config, content){

};

function tweetLocalImg( config, content ){
	var lopen = Rx.Observable.bindNodeCallback( lwip.open );

	return lopen( content.photo ).flatMap( img => {
		return Rx.Observable.create(function(obser){
			img.toBuffer( 'jpg', {quality : 60 }, (err,buf) => {
				obser.next(buf.toString('base64'))
			});
		});
	}).flatMap( img_b64 => tweet( config, content, img_b64) );
};

function tweet( config, content, img_b64 ){
	var T = new Twit( config );

	return Rx.Observable.create(function(obser){
		T.post('media/upload', { media_data: img_b64 }, (err, data) => {
			obser.next(data);
		})
	}).flatMap( data  => {
		return Rx.Observable.create(function(obser){
			T.post('media/metadata/create', { media_id : data.media_id_string }, function (err, createData, response) {
				if( err ){
					console.log( err );
				} else{
					obser.next(data);
				}
			});
		});
	}).flatMap( data  => {
		return Rx.Observable.create(function(obser){
			T.post('statuses/update', { status: content.msg, media_ids: [data.media_id_string] }, function (err, data, response) {
				if( err ){
					obser.error( err );
				} else {
					console.log(`https://twitter.com/bikelaneblitz/status/${data.id_str}`)
					obser.next(data);
				}
			});
		});
	});
};

module.exports = {
	tweetLocalImg,
	tweet
};
