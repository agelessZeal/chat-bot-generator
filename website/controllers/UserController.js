let _, async, mongoose, BaseController;
let config, axios, request, fs, crypto, View;
let  UserModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');
crypto = require('crypto');

UserModel = require('../models/user');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'UserController',
    run: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'frontend/user/index');
        v.render({
            title: 'Account Settings',
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
});
