const inquirer = require('inquirer');
const templates = require("./templates");

module.exports = function (){
	function templWithRemaining(data){
		var msg = templates[data.complaint](data);
		var remaining = `characters remaining:` + (140 - msg.length);
		return msg + '\n' + remaining + '\ntweet?';
	};

	var questions = [
		{ name: 'complaint', type: 'list', message: 'choose complaint', choices: Object.keys(templates) },
		{ name: 'photo', message: 'photo path:', filter: str => str.trim() },
		{ name: 'plate', message: 'plate #:'},
		{ name: 'comp_no', message: 'complaint #:'},
		{ name: 'tweet', type: 'confirm', message: data => templWithRemaining(data)},
		{ name: 'flickr', message: 'flickr notes' }
	];

	questions.forEach(item => item.when = function(answers){ return answers.type == 'Create'; });

	var updateQuestions = [
		{ name: 'comp_no2', message: 'complaint #:'},
	]

	updateQuestions.forEach(item => item.when = function(answers){
		return answers.type == 'Update';
	});


	var createOrUpdate = { name: 'type', type:'list', message: 'New or existing 311 complaint?', choices: [ 'Create', 'Update' ] };
	questions.unshift(createOrUpdate);
	questions.push(...updateQuestions);

	return inquirer.prompt(questions);
}
