module.exports = {
	'create' : {
		'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'failure_to_pull_over' : data => `failure to pull to curb. compl filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'block_crosswalk' : data => `blocking crosswalk, complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,

	},
	'update' : {
		'unable_to_identify' : data => `unable to identify driver or company #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'sent stip, asked to plead' : data => `sent stip, asked to plead guilty #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'hearing scheduled' : data => `hearing scheduled #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'plead_guilty_fined' : data => `pled guilty, paid fine #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'base_issued_summons' : data => `base failed to id driver, base issued summons #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'not_against_tlc_rules' : data => `illegal, tlc chooses not to enforce  #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
	}
};

