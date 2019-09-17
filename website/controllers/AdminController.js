let _, async, mongoose, BaseController;
let config, axios, request, fs, crypto,moment, View;
let UserModel, BotModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index');
fs = require('fs');
crypto = require('crypto');
moment = require('moment');

UserModel = require('../models/user');
BotModel = require('../models/bot');
BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'AdminController',
    run: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if(req.session.user.role == 'user'){
            return res.redirect('/*');
        }
        v = new View(res, 'admin/index');
        let users = await UserModel.find({role: 'user'});
        v.render({
            title: 'User List',
            session: req.session,
            userList: users,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    addUser: async function(req,res){
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if(req.session.user.role == 'user'){
            return res.redirect('/*');
        }
        v = new View(res, 'admin/edit-user');
        v.render({
            title: 'Add New User',
            session: req.session,
            isEdit: false,// This mean current view is update mode
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    editUser: async function(req,res){
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        // if(req.session.user.role != 'admin'){
        //     return res.redirect('/*');
        // }
        v = new View(res, 'admin/edit-user');
        let userInfo = await UserModel.findOne({user_id:req.params.userId});
        if (userInfo){
            v.render({
                title: 'Edit User',
                session: req.session,
                isEdit: true,// This mean current view is update mode
                userInfo: userInfo,
                error: req.flash("error"),
                success: req.flash("success"),
            });
        }else{
            return res.redirect('/*');
        }
    },
    deleteUser: async function(req,res){
        let userId = req.params.userId;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if(req.session.user.role != 'admin'){
            return res.redirect('/*');
        }
        let userInfo = await UserModel.findOne({user_id:userId});
        if(userInfo){
            await UserModel.deleteOne({user_id:userId});
            await BotModel.deleteMany({user_id:userId});
        }
        return res.redirect('/admin/users');
    },
    updateUser: async function(req,res){
        let userObj, pwd, conf_pwd;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }

        pwd = req.body.password;
        conf_pwd = req.body.confirm_password;
        if (req.query.mode == 'create') {
            console.log('---User Creating---');
            userObj = req.body;
            //check email duplication
            let prevUser = await UserModel.findOne({email:req.body.email});
            if(prevUser){
                req.flash('error', 'Someone has same email!');
                return res.redirect('/admin/users/add');
            }
            if(pwd != conf_pwd){
                req.flash('error', 'Confirm password mismatching!');
                return res.redirect('/admin/users/add');
            }
            userObj.user_id = this.makeID('USER', 10);
            userObj.role = 'user';
            userObj.password = crypto.createHash('md5').update(pwd).digest("hex");
            userObj.createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            userObj.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            delete req.body.confirm_password;
            await UserModel.collection.insertOne(userObj);
            req.flash('success', 'User Successfully Created');
            return res.redirect('/admin/users/add');
        } else {
            console.log('---Bot Updating---');
            let userId = req.query.user_id;
            if(pwd != conf_pwd){
                req.flash('error', 'Confirm password mismatching!');
                return res.redirect('/admin/users/edit/'+userId);
            }
            userObj = await UserModel.findOne({user_id: userId});

            if (userObj) {
                if(pwd){
                    userObj.password = crypto.createHash('md5').update(pwd).digest("hex");
                    console.log("updating password!!!!!!");
                }
                userObj.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                delete req.body.password;
                delete req.body.confirm_password;
                userObj = Object.assign(userObj, req.body);
                await userObj.save();

                if(req.session.user_id == req.params.userId){
                    req.session.user = userObj;
                    await req.session.save();
                }

                req.flash('success', "Updated user information!");
                return res.redirect('/admin/users/edit/'+userId);
            } else {
                return res.redirect('/*');
            }
        }
    }
});
