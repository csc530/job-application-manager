const express = require('express');
const router = express.Router();
const passport = require('passport');

const Application  = require('../models/application');

// *  websocket package for server side websocket
const{Server} = require('ws');

/* GET  jobs */
router.get('/', (req, res, next) => {
	const searchTitle = req.query.search;
	console.log(searchTitle ? searchTitle : 'Search indeed jobs');
	// res.redirect('/indeed/loading');
	const renderParams = {
		title: 'Search Indeed jobs',
		jobs: [],
		user: req.user,
	};
	res.render('indeed/index', renderParams);

});

/* GET loading page */
router.get('/loading', function (req, res, next) {
	res.render('loading', {title: 'Loading application', user: req.user});

});

/* GET add job */
router.get('/add', function (req, res, next) {
	const title = req.query.title;
	const link = req.query.link;
	Application.create(
		{
			jobTitle: title,
			jobLink: link,
			uid: req.user.id,
		}
		, (err, application) => {
			if(err)
				console.log(err);
			else
				console.log('job added');
		}
	);
	res.redirect('/indeed');
});


module.exports = router;
