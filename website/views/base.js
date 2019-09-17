let async, mongoose, config;

async = require('async');
mongoose = require('mongoose');
config = require('../config/index');


module.exports = function (response, template) {
    this.response = response;
    this.template = template;
};

module.exports.prototype = {
    extend: function (properties) {
        var Child = module.exports;
        Child.prototype = module.exports.prototype;
        for (var key in properties) {
            Child.prototype[key] = properties[key];
        }
        return Child;
    },
    render: async function (data) {
        if (this.response && this.template) {
            this.response.render(this.template, data);
        }
    },
};
