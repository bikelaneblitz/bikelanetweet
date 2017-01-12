module.exports = {
	'create' : {
		'cab_in_lane' : data => `cab in bike lane. complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'failure_to_pull_over' : data => `failure to pull to curb. compl filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'block_crosswalk' : data => `blocking crosswalk, complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'uturn' : data => `uturn, complaint filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'no_standing_zone' : data => `parked no standing zone, compl filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,
		'blocking the box' : data => `blocking the box, compl filed #bikenyc #visionzero #CyclistsWithCameras #nyc311 #${data.plate} #C1_1_${data.comp_no}`,

	},
	'update' : {
		'not_against_tlc_rules' : data => `illegal, tlc chooses not to enforce  #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'base_issued_summons' : data => `base failed to id driver, base issued summons #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'unable_to_identify' : data => `unable to identify driver or company #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'hearing scheduled' : data => `hearing scheduled #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'hearing_tomorrow' : data => `hearing tomorrow #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'sent_stip' : data => `sent stip, asked to plead or pay #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'paid_fine' : data => `pleaded guilty, paid fine #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'found_guilty' : data => `found guilty, fined #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
		'trial_no_show' : data => `trial no show, fined #bikenyc #visionzero #CyclistsWithCameras #nyc311 #C1_1_${data.comp_no}`,
	}
};

