const inquirer = require('inquirer');
const templates = require("./templates");

module.exports = function (){
	function templWithRemaining(data){
		var msg = templates[data.type][data.complaint](data);
		var remaining = `characters remaining:` + (140 - msg.length);
		return msg + '\n' + remaining + '\ntweet?';
	};

	var questions = [
		{ name: 'complaint', type: 'list', message: 'choose complaint', choices: Object.keys(templates['create']) },
		{ name: 'photo', message: 'photo path:', filter: str => str.trim() },
		{ name: 'plate', message: 'plate #:'},
		{ name: 'comp_no', message: 'complaint #:'},
		{ name: 'tweet', message: data => templWithRemaining(data), default: data => templates['create'][data.complaint](data)},
		{ name: 'flickr', message: 'flickr notes' }
	];

	questions.forEach(item => item.when = function(answers){ return answers.type == 'create'; });

	var updateQuestions = [
		{ name: 'complaint', type: 'list', message: 'choose complaint', choices: Object.keys(templates['update']) },
		{ name: 'plate', message: 'plate #:'},
		{ name: 'comp_no', message: 'complaint #:'},
		{ name: 'tweet', message: data => templWithRemaining(data), default: data => templates['update'][data.complaint](data) },
	]

	updateQuestions.forEach(item => item.when = function(answers){
		return answers.type == 'update';
	});

	var createOrUpdate = { name: 'type', type:'list', message: 'New or existing 311 complaint?', choices: [ 'create', 'update' ] };
	questions.unshift(createOrUpdate);
	questions.push(...updateQuestions);

	return inquirer.prompt(questions);
}
