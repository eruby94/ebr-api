var express = require('express');
var router = express.Router();
var helper = require('sendgrid').mail;
var from_email = new helper.Email('evanruby94@gmail.com', 'Evan Ruby');
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

router.post('/', function (req, res) {
    var mail = new helper.Mail();
    mail.setFrom(from_email);
    var personalization = new helper.Personalization();
    personalization.addTo(new helper.Email(req.body.email));
    personalization.addSubstitution(new helper.Substitution('[%first_name%]', req.body.first));
    mail.addPersonalization(personalization);
    mail.setTemplateId('79dfd2cd-2085-4a99-a790-94112af124db');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
        if (error) {
            console.log(error);
        }
        res.send({
            error: error,
            response: response
        });
    });
});

module.exports = router;
