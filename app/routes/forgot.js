var express = require('express');
var router = express.Router();
var crypto = require("crypto")
var User = require("../models/user.js")
var nodemailer = require("nodemailer")
var nodemailerSendgrid = require('nodemailer-sendgrid');

module.exports = function (){
    router.post('/forgot', function(req, res, next) {
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            console.log("Resetting "+req.body.email)
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    // req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    var transport = nodemailer.createTransport(
                        nodemailerSendgrid({
                            apiKey: process.env.SENDGRID_API_KEY
                        })
                    )
                    // var mailOptions = {
                    //     to: user.email,
                    //     from: 'daniel@noterist.com',
                    //     subject: 'Noterist Password Reset',
                    //     text: 'You are receiving this because you (or someone else) have requested the reset of the password for your noterist account.\n\n' +
                    //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    //     'https://noterist.com/#/reset/' + token + '\n\n' +
                    //     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    // };
                    var mailOptions = {
                        from: 'daniel@noterist.com',
                        "personalizations":[
                            {
                                "to":[
                                    {
                                       "email":user.email
                                    }
                                ],

                                "dynamic_template_data":{
                                    "token":token
                                }
                            }
                        ],
                        "template_id":"d-3df228b3d36942fc89719247fb9d5364"
                    };
                    transport.sendMail(mailOptions, function(err) {
                        res.sendStatus(200)
                        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    });
                });
            });
        });
    });

    router.post('/reset/', function(req, res) {
        User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                console.log("Failed password reset, no matching token/expired")
                // req.flash('error', 'Password reset token is invalid or has expired.');
                // return res.redirect('back');
                return;
            }

            user.password = user.generateHash(req.body.password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
            //     req.logIn(user, function(err) {
            //         var transport = nodemailer.createTransport(
            //             nodemailerSendgrid({
            //                 // apiKey: process.env.SENDGRID_API_KEY
            //             })
            //         )
            //         var mailOptions = {
            //             to: user.email,
            //             from: 'daniel@noterist.com',
            //             subject: 'Your Noterist password has been changed',
            //             text: 'Hello,\n\n' +
            //             'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            //         };
            //         smtpTransport.sendMail(mailOptions, function(err) {
            //             // req.flash('success', 'Success! Your password has been changed.');
            //         });
            //     });
            });
        });
    });

    return router;
}
