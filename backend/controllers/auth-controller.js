const otpService = require('../services/otp-service')
const hashService = require('../services/hash-service');
const { verifyOtp } = require('../services/otp-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');


class AuthController{
    async sendOtp(req, res){
       const {phone} = req.body;
       if(!phone){
           res.status(400).json({message: 'Phone field is required!'});
       }

       const otp = await otpService.generateOtp();
       //hash generation
       const time = 1000 *60 *2;
       const expires = Date.now()+time;
       const data = `${phone}.${otp}.${expires}`;
       const hash = hashService.hashOtp(data);
       //otp sending
      try{
        //await otpService.sendBySms(phone,otp);
         res.json({
            hash: `${hash}.${expires}`,
            phone,
            otp,
        }
        )
      }catch(err){
          console.log(err)
          res.status(500).json({message: 'message sending failed'})
      } 

}


//verify-otp
async verifyOtp(req,res){
    const {otp, hash, phone} = req.body;
    if(!otp || !hash || !phone){
        req.status(400).json({message: "All field required!"});
    }
    const [hashedOtp, expires] = hash.split('.');
    if(Date.now()> +expires){
        res.status(400).json({message: 'OTP expired'});
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if(!isValid){
        res.status(400).json({message:'Your OTP is Invalid'});
    }

    let user;
    

    try{
        user= await userService.findUser({phone});
        if(!user){
          user=  await userService.createUser({phone})
        }
       }catch(err){
           console.log(err);
           res.status(500).json({message: 'Db error'});
   
       }
//token
const {accessToken, refreshToken}= tokenService.generateTokens({_id: user._id, activated: false});
       res.cookie('refreshToken',refreshToken,{
           maxAge: 1000*60*60*24*30,
           httpOnly: true
       });
       res.json({accessToken})
}

}

module.exports = new AuthController();