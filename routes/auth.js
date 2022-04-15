const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//#region Login
/* GET login page. */
router.get('/login', (req, res, next) => {
	const renderParams = {
		title: 'Login',
		user: req.user
	};
	res.render('auth/login', renderParams);
});

/* POST login page. */
router.post('/login',
	/** Adds username field to request body so passport can authenticate
	 * because that's where ti looks for it (and I didn't want to change up all my code) */
	(req, res, next) => {
		req.body.username = req.body.email;
		next();
	},
	(passport.authenticate('local', {
		successRedirect: '/application/',
		failureRedirect: 'login',
		failureMessage: 'Incorrect Credentials'
	}
	))
);
//#endregion

//#region Register
/* GET register page. */
router.get('/register', (req, res, next) => {
	const renderParams = {
		title: 'Register',
		user: req.user
	};
	res.render('auth/register', renderParams);
});

/* POST register page. */
router.post('/register', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.register(
		new User({username: email}),
		password,
		(err, newUser) => {
			if(err) {
				console.log(err);
				res.status(500);
				return res.redirect('register');
			}
			else
				req.login(newUser, err => {
					if(err) {
						console.log(err);
						res.status(500);
						return res.redirect('register');
					}
					else
						return res.redirect('/application/');
				});
		}
	);
});

//#endregion

/* GET logout */
router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/');
});

//#region Github

/*
 GET handler for /github
 call passport authenticate and pass the name of the strategy
 and the information we require from github
 */
router.get('/github', passport.authenticate('github', {scope: ['user.email']}));
//GET handler for github/callback
//GitHub sending the user back
router.get('/github/callback',
	//? if login is unsuccessful , redirects to login
	passport.authenticate('github', {failureRedirect: '/auth/login'}),
	(req, res, next) => {
		res.redirect('/application');
	});
/* * Register */
//#endregion


module.exports = router;
