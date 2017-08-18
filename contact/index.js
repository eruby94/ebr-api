var express = require('express');
var router = express.Router();
var helper = require('sendgrid').mail;
var my_email = new helper.Email('evanruby94@gmail.com', 'Evan Ruby');
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

router.post('/', function (req, res) {
    var mail = new helper.Mail();
    mail.setFrom(my_email);
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
            console.log('error: ' + error);
            res.send(response);
        } else {
            var mail2 = new helper.Mail();
            mail2.setFrom(new helper.Email(req.body.email));
            var personalization2 = new helper.Personalization();
            personalization2.addTo(my_email);
            personalization2.addSubstitution(new helper.Substitution('[%first_name%]', req.body.first));
            personalization2.addSubstitution(new helper.Substitution('[%last_name%]', req.body.last));
            personalization2.addSubstitution(new helper.Substitution('[%message%]', req.body.message));
            mail2.addPersonalization(personalization2);
            mail2.setTemplateId('4d236d5a-e9b9-411c-923e-d8b80ea3e9b6');
            var request2 = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail2.toJSON(),
            });
            sg.API(request2, function(error2, response2) {
                if (error2) {
                    console.log('error2: ' + error2);
                }
                res.send(response2);
            });
        }
    });
});

module.exports = router;
