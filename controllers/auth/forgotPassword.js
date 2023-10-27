const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user'); // Assuming your User model is in 'model/user'
const sendEmail = require('../../utils/email');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

exports.forgotPassword = catchAsyncError(async (req, res, next)=>{
        const user = await User.findOne({email: req.body.email})
    
        if(!user){
            return next(new ErrorHandler("User not found", 403))
        }
    
        const resetToken = user.getUserPassword();
    
      //because it only generate password not validates
        await user.save({validateBeforeSave: false})
    
        //for creating rest url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`
    
        //for setting message in mail.
        const message = `Your password reset URL is: \n\n ${resetUrl} \n\n If not you, please ignore.`
    
        try{
    //key word already given in sendEmail function in utiities file
           sendEmail({
                email: user.email,
                subject: "Food delivery app password recovery",
                message
            })
    
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
        
               
            })
    
        }catch(err){
            user.resetPassword = undefined;
            user.resetPasswordTokenExpire = undefined
            await user.save({validateBeforeSave: false})
            return next(new ErrorHandler(err.message), 500)
        }
    })
