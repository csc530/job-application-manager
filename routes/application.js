var express = require('express');
var router = express.Router();

const User = require('./../models/user');
const Application = require('./../models/application');
const Action = require('./../models/action');

//? create reusable middleware function
function authenticate(req, res, next) {
	if(req.isAuthenticated())
		return next();
	else
		res.redirect('/auth/login');
}

// ? add authentication first to router to protect all of the routes pages; needs to be authenticated to see anything pertaining to applications
router.use(authenticate);

/* GET home page. */
router.get('/', function (req, res, next) {
	const renderParams = {
		title: 'Job Application Manager',
		applications: [],
		user: req.user
	};
	Application.find(
		{uid: req.user.id.toString()},
		(err, applications) => {
			if(err) {
				console.log(err);
				return res.sendStatus(500);
			}
			else{
				renderParams.applications = applications;
				res.render('application/index', renderParams);
			}
		}
	);
});

/* GET add application */
router.get('/add', (req, res, next) => {
	const renderParams = {
		title: 'Create new application',
		user: req.user
	};
	Action.find(
		{uid: req.user.id.toString()},
		(err, actions) => {
			if(err) {
				console.log(err);
				return res.sendStatus(500);
			}
			else
				renderParams.actions = actions;
			res.render('application/add', renderParams);
		});
});

/* POST add application */
router.post('/add', (req, res, next) => {
	const uid = req.user._id.toString();
	const values = req.body;
	const jobTitle = values.jobTitle.toString().trim();
	const postedDate = values.postedDate;
	const actions = values.action;
	const jobLink = values.jobLink;
	if(values.response === 'NULL')
		values.response = null;
	const response = values.response;

	// * Upload actions for user to refer to again
	uploadActions(uid, actions);

	const applicationDate = values.applicationDate;
	Application.create({
		jobTitle: jobTitle,
		applicationDate: applicationDate,
		postedDate: postedDate,
		action: actions,
		uid: uid,
		jobLink: jobLink,
		response: response
	}, (err, application) => {
		if(err || !application) {
			console.log(`Error: ${err}`);
			res.status(400);
			//redirect back with status code 400 displaying error
			res.redirect('add');
		}
		else{
			res.status(200);
			res.redirect('/application');
		}
	});
});

function uploadActions(uid, actions) {
	console.dir(actions);
	// * Find if there is already an action with the same name to the user if not upload it
	// ? the two cases of the if is if an array of actions is passed or just one action
	if(typeof actions === 'object')
		for(let i = 0; i < actions.length; i++) {
			if(actions[i].toString().trim() !== 'NULL')
				Action.findOne({uid: uid, name: actions[i]}, (err, action) => {
					console.log(`Action: ${action}`);
					if(err)
						console.log(err);
					else if(!action) {
						Action.create({
							name: actions[i],
							uid: uid
						}, (err, action) => {
							if(err)
								console.log(err);
						});
					}
				});
		}
	else
		Action.findOne({uid: uid, name: actions}, (err, action) => {
			console.log(action);
			if(err)
				console.log(err);
			else if(!action) {
				Action.create({
					name: actions,
					uid: uid
				}, (err, action) => {
					if(err)
						console.log(err);
				});
			}
		});
}

/* GET edit application */
router.get('/edit/:id', (req, res, next) => {
	const id = req.params.id;
	const renderParams = {
		title: 'Edit application',
		user: req.user,
	};
	Application.findById(id, (err, application) => {
		if(err || !application) {
			console.log(`Error: ${err}`);
			res.status(400);
			//redirect back with status code 400 displaying error
			res.redirect('/application');
		}
		else{
			renderParams.application = application;
			Action.find(
				{uid: req.user.id.toString()},
				(err, actions) => {
					if(err) {
						console.log(err);
						return res.sendStatus(500);
					}
					else
						renderParams.actions = actions;
					res.render('application/edit', renderParams);
				}
			);
		}
	});
});

/* POST edit application */
router.post('/edit/:id', (req, res, next) => {
	const id = req.params.id;
	const values = req.body;
	const jobTitle = values.jobTitle.toString().trim();
	const postedDate = values.postedDate;
	const action = values.action;
	const applicationDate = values.applicationDate;
	const jobLink = values.jobLink;
	if(values.response === 'NULL')
		values.response = null;
	const response = values.response;
	Application.findByIdAndUpdate(id, {
		jobTitle: jobTitle,
		applicationDate: applicationDate,
		postedDate: postedDate,
		action: action,
		jobLink: jobLink,
		response: response
	}, (err, application) => {
		if(err || !application) {
			console.log(`Error: ${err}`);
			res.status(400);
			//redirect back with status code 400 displaying error
			res.redirect('/application');
		}
		else{
			res.status(200);
			res.redirect('/application');
		}
	});
});

/* GET delete application */
router.get('/delete/:id', (req, res, next) => {
	const id = req.params.id;
	Application.findByIdAndRemove(id, (err, application) => {
		if(err || !application) {
			console.log(`Error: ${err}`);
			res.status(400);
			//redirect back with status code 400 displaying error
			res.redirect('/application');
		}
		else{
			res.status(200);
			res.redirect('/application');
		}
	});
});

module.exports = router;
