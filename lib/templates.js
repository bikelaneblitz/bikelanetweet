module.exports = {
	'create' : {
		'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'failure_to_pull_over' : data => `failure to pull to curb. compl filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`
	},
	'update' : {
		'unable_to_identify' : data => `unable to identify driver or company #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`
	}
};

