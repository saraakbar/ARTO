const crypto = require('crypto');
const nodemailer = require('nodemailer');
Token = require('../models/tokenModel')

function sendEmail(mailOptions) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.FROM_EMAIL,
          pass: process.env.FROM_EMAIL_PASSWORD,
        }
      });
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

function generateVerificationToken(user, verify) {
    let payload = {
        userId: `${user._id}`,
        token: crypto.randomBytes(20).toString('hex'),
        verify: verify,
    };

    return new Token(payload);
};

async function sendVerificationEmail(user, req, res, verify){
    try{
        const token = generateVerificationToken(user, verify);

        // Save the verification token
        await token.save();
        
        let subject = "Reset Password";
        let to = user.email;
        let from = "ARTO - Augmented Reality Try-On";
        let html= "";
        let link= "";
    
        link="http://localhost:3000/reset-password/"+token.token;
        html = `<p>Hi ${user.username},<p><br><p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
        <br><p>If you did not request this, please ignore this email.</p>`;
        
        await sendEmail({to, from, subject, html});
        res.status(200).json({message: 'An email has been sent to ' + user.email + '.'});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
}
module.exports = {
    sendEmail,  generateVerificationToken, sendVerificationEmail
}