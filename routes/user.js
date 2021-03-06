var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('./helpers/auth');

/* GET users listing. */
router.get('/', auth.requireLogin, function(req, res, next) {
  User.find({}, 'username', function(err, users) {
  	if (err) {
  		console.error(err);
  	}
  	else {
  		res.render('users/index', {users: users});
  	}
  });
});

// redirect to new user creation page
router.get('/newUser', function(req, res, next) {
	res.render('users/newUser');
});

// write username into database
router.post('/newUser', function(req, res, next) {
	User.validate(req.body, (err, user) => {
		if (err || user) {
			return res.send(err.message);
		}
		const newUser = new User(req.body);
		newUser.save(function(err, user) {
			if (err) {
				console.error('New user not created');
			}
			return res.redirect('/users');
		});
	});
});

module.exports = router;
