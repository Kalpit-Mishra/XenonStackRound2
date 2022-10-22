const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Contact = require('../models/contact');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});

router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

router.post('/registration', (req, res, next) => {
	let personInfo = req.body;

	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					let c;
					User.findOne({}, (err, data) => {

						if (data) {
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						let newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					//res.send({ "Success": "You are regestered,You can login now." });
					res.redirect('/login')
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});


router.get('/logoff', (req, res, next) => {
	return res.render('logout.ejs');
});

router.get('/registration', (req, res, next) => {
	return res.render('registration.ejs');
});



router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				//res.send({ "Success": "Success!" });
				res.redirect('/logoff');
			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

router.get('/profile', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.get('/logout', (req, res, next) => {
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

router.post('/forgetpass', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

router.post('/contact', (req, res, next) => {
	let messageInfo = req.body;

	if (!messageInfo.email || !messageInfo.name || !messageInfo.phone || !messageInfo.message) {
		res.send();
	} else {
			let newMessage = new Contact({
			unique_id: uuidv4(),
			email: messageInfo.email,
			name: messageInfo.name,
			phone: messageInfo.phone,
			message: messageInfo.message,
			});

			newMessage.save((err) => {
				if (err)
				console.log(err);
					else
					res.send({ "Success": "Thank you for contacting us!!" });
			});			
	}
});

router.get('/contact', (req, res, next) => {
	return res.render('contact.ejs');
});



module.exports = router;