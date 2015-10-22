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
        imageDim : {
            thumb : {
                width : 256,
                height : 222
            }
        }
//        payUconfig : {
//            //merchant_key : 'lIzTPW',
//            //merchant_salt : 'T76xJcsD',
//            merchant_key : 'gtKFFx',
//            merchant_salt : 'eCwWELxi',
//            testPayUrl : 'https://test.payu.in/_payment',
//            livePayUrl : 'https://secure.payu.in/_payment',
//            failUrl : 'http://localhost:8080/payment-fail',
//            successUrl : 'http://localhost:8080/payment-success',
//            cancelUrl : 'http://localhost:8080/payment-fail'
//        },
//        mode: ["Album", "Passport photographs", "Posters and frame"]
    }
};
module.exports = configVars[env];