let _, async, mongoose, BaseController;
let config, axios, request, fs, crypto, ejs,
    nodemailer, transporter, moment;
let UserModel, View;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
crypto = require('crypto');
nodemailer = require('nodemailer');
request = require('request');
config = require('../config/index');
fs = require('fs');
ejs = require('ejs');
moment = require('moment');

UserModel = require('../models/user');
BaseController = require('./BaseController');
View = require('../views/base');

transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.node_mail.mail_account,
        pass: config.node_mail.password
    }
});

module.exports = BaseController.extend({
    name: 'AuthController',
    login: async function (req, res) {
        await this.config();
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        let v;
        v = new View(res, 'auth/login');
        v.render({
            title: 'Sign In',
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    loginUser: async function (req, res) {
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        let email = req.body.email.trim();
        let password = crypto.createHash('md5').update(req.body.password).digest("hex");
        let userInfo = await UserModel.findOne({email: email, password: password});
        if (userInfo == null) {
            req.flash('error', 'Incorrect email or password.');
            return res.redirect('/auth/login');
        }
        req.session.login = true;
        req.session.user = userInfo;
        userInfo.last_login = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        await userInfo.save();
        if(userInfo.role == 'admin'){
            return res.redirect('/admin/users');
        }
        return res.redirect('/');
    },

    forgotPassword:async function(req,res){
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        let v;
        v = new View(res, 'auth/forgot-password');
        v.render({
            title: 'Forgot Password',
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },

    resetPassword:async function(req,res){
        let email, userinfo;
        email = req.body.email;
        userinfo = await UserModel.findOne({email: email});
        if (userinfo == null) {
            req.flash('error', 'Can not find your email.');
            return res.redirect('/auth/forgot-password');
        } else {
            let token = this.makeID('', 30);
            let confirmURL = config.info.site_url + 'password/reset/' + token;
            userinfo.token = token;
            console.log(userinfo.token);
            UserModel.updateOne({email:email},{token:token},function (err,data) {
                if (err) {
                    console.log(err);
                    req.flash('error','Something went wrong!');
                    return res.redirect('/auth/forgot-password');
                } else {
                    ejs.renderFile("views/email/reset-password.ejs",
                        {
                            site_url: config.info.site_url,
                            confirm_url: confirmURL,
                            site_name: config.info.site_name
                        },
                        function (err, data) {
                            if (err) {
                                console.log(err);
                                req.flash('error', 'Please check Provider Email');
                                return res.redirect('/auth/forgot-password');
                            } else {
                                var mailOptions = {
                                    from: config.node_mail.mail_account, // sender address
                                    to: email, // list of receivers
                                    subject: '[' + config.info.site_name + ']Please reset your password', // Subject line
                                    text: config.info.site_name + ' ✔', // plaintext body
                                    html: data // html body
                                };
                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        req.flash('error','Something went wrong!');
                                        return res.redirect('/auth/forgot-password');
                                    } else {
                                        console.log('Message sent: ' + info.response);
                                        req.flash('success', 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.');
                                        return res.redirect('/auth/forgot-password');
                                    }
                                });
                            }
                        });
                }
            });
        }
    },

    showPasswordChange:async function(req,res){
        let token, userinfo;
        token = req.params.token;
        userinfo = await UserModel.findOne({token: token});
        if (userinfo != null) {
            var v = new View(res, 'auth/change-password');
            v.render({
                token: token,
                username: userinfo.username,
                session: req.session,
                error: req.flash("error"),
                success: req.flash("success"),
                title: 'Change Password'
            });
        } else {
            return res.redirect('/auth/login');
        }
    },

    passwordChange:async function(req,res){
        let token, userinfo, new_pass, confirm_pass;
        token = req.body.token;
        userinfo = await UserModel.findOne({token: token});
        if (userinfo != null) {
            new_pass = req.body.new_password;
            confirm_pass = req.body.confirm_password;
            if (new_pass != confirm_pass) {
                req.flash('error', 'Confirm Password doesn\'t match!');
                return res.redirect('/password/reset/' + token);
            } else {
                userinfo.password = crypto.createHash('md5').update(new_pass).digest("hex");
                userinfo.token = "";
                await userinfo.save();
                req.flash("success", 'New password set successfully.');
                return res.redirect('/auth/login');
            }
        } else {
            req.flash('error', 'User doesn\'t exist!');
            return res.redirect('/password/reset/' + token);
        }
    },

    logout: async function (req, res) {
        req.session.login = false;
        req.session.user = null;
        req.session.save();
        return res.redirect('/auth/login');
    },
    config: async function () {
        ///Add Admin
        let adminInfo = await UserModel.findOne({role: 'admin'});
        if (adminInfo == null) {
            //Password 111111
            await UserModel.collection.insertOne({
                "user_id" : "user_BuUbruAfUe",
                "username" : "admin",
                "email" : "admin@admin.com",
                "password" : "96e79218965eb72c92a549dd5a330112",
                "avatar_path" : "/assets/images/avatar/user4.jpg",
                "role" : "admin",
                "createdAt" : new Date(),
                "last_login" : "2019-02-13 02:34:25"
            });
        }
    }
});
