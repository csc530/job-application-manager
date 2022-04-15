var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var applicationRouter = require('./routes/application');
const authRouter = require('./routes/auth');
const indeedRouter = require('./routes/indeed');

const hbs = require('hbs');

//passport related objects
const passport = require('passport');
const session = require('express-session');
const githubStrategy = require('passport-github2').Strategy;

const mongoose = require('mongoose');

var app = express();
// Connect to DB - mongoDB
// only for development
require('dotenv').config();
const dbString = process.env['db'] + 'assignment2';
// Use the connect method, and the two handlers to try to connect to the DB
mongoose
	.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(message => console.log('Connected successfully!\nUsing database: ' + message.connection.db.databaseName))
	.catch(error => console.log(`Error while connecting! ${error}`));

//#region passport authentication
//Configure session and passport before all router declarations
//1. configure the app to use sessions
app.use(
	session({
		secret: process.env['superSecret'],
		resave: false,
		saveUninitialized: false,
	})
);

//2. configure the app to use passport
app.use(passport.initialize());
app.use(passport.session());
//3. Link passport to user model (mongoose)
const User = require('./models/user');
//passport will use the User model to create a
passport.use(User.createStrategy());
//4. Set passport to read/write user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//3.b Create github auth strategy
passport.use(
	new githubStrategy(
		{
			clientID: process.env['githubID'],
			clientSecret: process.env['githubSecret'],
			//todo change for production
			callbackURL: 'http://localhost:3000/auth/github/callback/',
		},
		// create async callback function
		// profile is github profile
		async (accessToken, refreshToken, profile, done) => {
			// search user by ID
			const user = await User.findOne({oauthId: profile.id});
			// user exists (returning user)
			if(user) {
				// no need to do anything else
				return done(null, user);
			} else{
				// new user so register them in the db
				const newUser = new User({
					username: profile.username,
					oauthId: profile.id,
					oauthProvider: 'Github',
					created: Date.now(),
				});
				// add to DB
				const savedUser = await newUser.save();
				// return
				return done(null, savedUser);
			}
		}
	)
);

//#endregion

// HBS Helper Method to select values from dropdown lists


//LongDate value comes from the UI as 'day Mon year HH:MM:SS Timezone (tz name)'
//and this helper method will return 2022-02-14 << international format
hbs.registerHelper('toShortDate', date=>{
	if(date)
		return new hbs.SafeString(date.toLocaleDateString());
});

// function name and helper function with parameters
hbs.registerHelper('authBar', (user) => {
	// * Check  user is logged in
	if(!user) {
		// * If logged in, show logout button
		return new hbs.SafeString(
			`<a href="/auth/login" class="navbar-item">Log in</a>
			<a href="/auth/register" class="navbar-item">Sign up</a>`
		);
	}
	// * If not logged in, show login button
	return new hbs.SafeString(
		`<a id="user-name" href="#" class="navbar-item level-right">${user.username}</a>
		<a href="/auth/logout" class="navbar-item">Logout</a>`
	);
});

// function name and helper function with parameters
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
	// initialize selected property
	var selectedProperty = '';
	// if values are equal set selectedProperty accordingly
	if(currentValue == selectedValue)
		selectedProperty = 'selected';

	// return html code for this option element
	// return new hbs.SafeString('<option '+ selectedProperty +'>' + currentValue + '</option>');
	return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/application', applicationRouter);
app.use('/auth', authRouter);
app.use('/indeed', indeedRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

