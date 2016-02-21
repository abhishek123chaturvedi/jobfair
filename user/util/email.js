/**
 * Created by Abhishek Chaturvedi on 21/10/15.
 */
var mandrill = require('mandrill-api/mandrill'),
    config = require('../config/config'),
    mandrill_client = new mandrill.Mandrill(config.mandrill_api_key), // Paste your API key
    template_name = "Example-template",
    template_name1 = "reset_password";

var Email = {
    send: function(templateName, message, successCallback, errorCallback) {
        message.from_email = config.mail_settings.from_mail;
        message.from_name = config.mail_settings.from_name;
        message.important = config.mail_settings.important;
        message.merge = config.mail_settings.merge;
        message.merge_language = config.mail_settings.merge_language;

        mandrill_client.messages.sendTemplate({
            "template_name": templateName,
            "message": message,
            "template_content": [],
            "async": false
        }, successCallback, function(e) {
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    }
};

module.exports = Email;
