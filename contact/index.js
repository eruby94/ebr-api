const express = require('express');
const router = express.Router();
const myEmail = 'Evan Ruby <evanruby94@gmail.com>';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('[%', '%]');

router.post('/', function(req, res) {
	let otherSender =
		req.body.first + ' ' + req.body.last + ' <' + req.body.email + '>';
	let messages = [
		{
			to: req.body.email,
			from: myEmail,
			templateId: '79dfd2cd-2085-4a99-a790-94112af124db',
			substitutions: {
				first_name: req.body.first
			}
		},
		(msg = {
			to: myEmail,
			from: otherSender,
			templateId: '4d236d5a-e9b9-411c-923e-d8b80ea3e9b6',
			substitutions: {
				first_name: req.body.first,
				last_name: req.body.last,
				message: req.body.message
			}
		})
	];

	sgMail
		.send(messages)
		.then(() => {
			res.sendStatus(200);
		})
		.catch(error => {
			//Log friendly error
			console.error(error.toString());

			//Extract error msg
			const { message, code, response } = error;

			//Extract response msg
			const { headers, body } = response;

			res.sendStatus(code);
		});
});

module.exports = router;
