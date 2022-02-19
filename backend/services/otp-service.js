const crypto = require('crypto');
const hashService = require('./hash-service');
const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSid, smsAuthToken, {
    lazyloading:true
});

class OtpService{
    async generateOtp(){
        const otp = crypto.randomInt(1000,9990);
        return otp;
    }
    async sendBySms(phone,otp){
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `OTP ${otp}`,
        });

    }
    verifyOtp(hashedOtp, data){

            let computedHash = hashService.hashOtp(data);
            {return computedHash === hashedOtp;
                return true;
            }
            return false;
    }

}

module.exports = new OtpService();