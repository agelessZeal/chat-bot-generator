let _, config, _ld, qs, fs, UserModel;

_ = require("underscore");
config = require('../config/index');
crypto = require("crypto");

_ld = require('lodash');
qs = require('qs');
fs = require('fs');

UserModel = require('../models/user');

module.exports = {
    name: "BaseController",
    extend: function (child) {
        return _.extend({}, this, child);
    },
    run: function (req, res, next) {
    },

    isLogin: function (req) {
        // await this.config();
        if (typeof req.session.login != "undefined") {
            return req.session.login;
        } else {
            return false;
        }
    },

    makeID: function (prefix = "", length = 10) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return (prefix + text);
    },
    isEmail: function (email) {
        let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    },
    isURL: function (str) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return regexp.test(str);
    },
    validatePassord: function (password) {
        /*
         /^
         (?=.*\d)          // should contain at least one digit
         (?=.*[a-z])       // should contain at least one lower case
         (?=.*[A-Z])       // should contain at least one upper case
         [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
         $/
         */
        return password.match(/^(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8})$/);
    },
    getTs: function () {
        return Math.round((new Date()).getTime() / 1000);
    },
    //https://stackoverflow.com/questions/6137986/javascript-roundoff-number-to-nearest-0-5
    round: function (value, step) {
        step || (step = 1.0);
        let inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    },
    extractHostname: function (url) {
        let hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    },

    // To address those who want the "root domain," use this function:
    extractRootDomain: function (url) {
        let domain = this.extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;

        //extracting the root domain here
        //if there is a subdomain
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
            if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
                //this is using a ccTLD
                domain = splitArr[arrLen - 3] + '.' + domain;
            }
        }
        return domain;
    },
    config: async function () {
        let adminInfo = await UserModel.findOne({role: 'admin'});
        if (adminInfo == null) {
            await UserModel.collection.insertOne({
                "user_id": "user_BuUbruAfUe",
                "username": "user1",
                "password": "02a05c6e278d3e19afaca4f3f7cf47d9", /// Password is "qqqqqqq"
                "role": "admin",
                "gads_info": {
                    "clientCustomerId": config.gads_info.clientCustomerId,
                    "refresh_token": "",
                },
                "createdAt": new Date("2019-02-01T16:08:51.667Z"),
            });
        }
    }
};
