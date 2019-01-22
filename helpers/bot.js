const fs = require('fs');
const path = require('path');
const Slack = require('node-slack-upload');
const scheduler = require('./scheduler');
const Utils = require('./utils');

const token = Utils.processEnv('SLACK_TOKEN');
// const barcode = require('./barcode');

const bot = new Slack(token);
let pollInterval = null;

function init() {
	sendMessage();
	//Try to send a message on launch, and retry avery 15 minutes
	pollInterval = setInterval(sendMessage, Utils.minutesToMs(15));
}

function sendMessage() {
	if(scheduler.onSchedule()) {
		const channel = Utils.processEnv('SLACK_CHANNEL');
		const fileName = '96dc48e407313515856ea7770fd15781'; //TODO: getHash dynamically
		//TODO: check file exists, otherwise generate file first.
		//TODO: add dynamic title with date ?

		bot.uploadFile({
		    file: fs.createReadStream(path.join(__dirname,`../${Utils.processEnv('RESULT_FOLDER')}/output_${fileName}.jpg`)),
		    mimetype: 'image/jpeg',
        	filetype: 'jpg',
		    title: 'Today\' barcode',
		    channels: channel
		}, function(err, data) {
		    if (err) {
		        console.error(`bot.sendMessage.fileUploadError=${err}`);
		    }
		});

	}
}

module.exports = {
	init
};
