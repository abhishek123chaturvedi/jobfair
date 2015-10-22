/**
 * Created by Abhishek on 15/10/15
 */
var env = process.env.NODE_ENV || 'local';
var configVars = {
    local : {
        dbUrl : "mongodb://localhost:27017/jobfair",
        facebook: {
            clientID: '921756577886381',
            clientSecret: 'e9472896d97d9ab3046050d8d5700970',
            callbackURL: 'http://localhost:8080/auth/facebook/callback'
        },
        google: {
            returnURL: 'http://localhost:8080/auth/google/callback',
            realm: 'http://localhost:8080/'
        },
        smtpSetting : {
            host: 'smtp.gmail.com',
            port: 587,
            requiresAuth: true,
            auth: {
                user: 'jain.robin76@gmail.com',
                pass: 'mathematics15'
            }
        },
        imageDim : {
            thumb : {
                width : 256,
                height : 222
            }
        },
        verification_message: "Thank you for the registration with Jobfair. Your verification code is ",
        successful_signup_message :"Thank you for the registration with My Jobfair you can access our services now.",
        mobile_number_prefix :"91",
        mandrill_api_key :"veO8qnwghMJLF_N7IX6Nlg",
        mail_settings : {
            from_mail : 'info@jobfair.com',
            from_name : 'Jobfair',
            important : 'true',
            merge : 'true',
            merge_language : 'mailchimp'
        }
    }
};
module.exports = configVars[env];