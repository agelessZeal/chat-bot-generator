let express, router, config, path;
let  error_controller,dashboard_controller,
    auth_controller,base_controller,admin_controller;

let UserModel;

path = require('path');
express = require('express');
router = express.Router();
config = require('./config/index');

UserModel = require('./models/user');

error_controller = require('./controllers/ErrorController');
dashboard_controller = require('./controllers/DashboardController');
auth_controller = require('./controllers/AuthController');
base_controller = require('./controllers/BaseController');
admin_controller = require('./controllers/AdminController');


router.get('/', function (req, res) {
    dashboard_controller.run(req, res);
});

router.get('/bots', function (req, res) {
    dashboard_controller.showBots(req, res);
});

router.get('/edit-bot/:botId', function (req, res) {
    dashboard_controller.editBot(req, res);
});

router.get('/gen/:botId', function (req, res) {
    dashboard_controller.generateScript(req, res);
});

router.get('/add-bot', function (req, res) {
    dashboard_controller.addBot(req, res);
});

router.post('/update-bot', function(req,res){
    dashboard_controller.updateBot(req,res);
});

router.get('/bot/delete/:botid', function(req,res){
    dashboard_controller.deleteBot(req,res);
});

router.get('/bot/src/:botId', function(req,res){
    dashboard_controller.sendBotHTML(req,res);
});

router.post('/bot/email/:botId', function(req,res){
    dashboard_controller.sendBotMsg(req,res);
});

router.post('/upload/image', function (req,res) {
    dashboard_controller.imageUpload(req,res);
});

router.post('/upload/icon', function (req,res) {
    dashboard_controller.avatarUpload(req,res);
});



/******************************************************************
 *                  Admin Controller                               /
 ******************************************************************/
router.get('/admin/users', function(req,res){
    admin_controller.run(req,res);
});

router.get('/admin/users/add', function(req,res){
    admin_controller.addUser(req,res);
});

router.get('/admin/users/edit/:userId', function(req,res){
    admin_controller.editUser(req,res);
});

router.get('/admin/users/delete/:userId', function(req,res){
    admin_controller.deleteUser(req,res);
});

router.post('/admin/users/update', function(req,res){
    admin_controller.updateUser(req,res);
});

/******************************************************************
 *                  Auth Controller                               /
 ******************************************************************/
router.get('/auth/login', function (req, res) {
    auth_controller.login(req, res);
});

router.post('/auth/login', function (req, res) {
    auth_controller.loginUser(req, res);
});

router.get('/auth/logout', function (req, res) {
    auth_controller.logout(req, res);
});

router.get('/auth/forgot-password', function (req, res) {
    auth_controller.forgotPassword(req, res);
});

router.post('/auth/reset_password', function (req, res) {
    auth_controller.resetPassword(req, res);
});

router.get('/password/reset/:token', function (req, res) {
    auth_controller.showPasswordChange(req, res);
});

router.post('/password/reset', function (req, res) {
    auth_controller.passwordChange(req, res);
});

/***************************************************************
 *                  Error Controller                           /
 **************************************************************/
router.get('*', function (req, res) {
    error_controller.show_404(req, res);
});

module.exports = router;
