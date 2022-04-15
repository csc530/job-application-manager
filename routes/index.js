var express = require('express');
var router = express.Router();
const Application = require('../models/application');

/* GET home page. */
router.get('/', function (req, res, next) {
	Application.find({}).limit(10).exec((err, applications) => {
		if(err) {
			console.log(err);
			return res.sendStatus(500);
		}
		else
			res.render('index', {
				title: 'Home',
				user: req.user,
				applications: applications
			});
	});
});

module.exports = router;
