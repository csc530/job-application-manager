const express = require('express');
const router = express.Router();
const passport = require('passport');

const Application  = require('../models/application');

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
