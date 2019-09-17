let _, async, mongoose, BaseController, View, path;
let config, axios, request, fs, fse, moment;
let nodemailer, ejs, transporter;
let UserModel, BotModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
path = require('path');
config = require('../config/index');
fs = require('fs');
fse = require('fs-extra');
request = require('request');
moment = require('moment');
nodemailer = require('nodemailer');
ejs = require('ejs');

BaseController = require('./BaseController');
View = require('../views/base');
UserModel = require('../models/user');
BotModel = require('../models/bot');

transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.node_mail.mail_account,
        pass: config.node_mail.password
    }
});

module.exports = BaseController.extend({
    name: 'DashboardController',
    run: async function (req, res) {
        return res.redirect('/bots');
        let v;
        v = new View(res, 'home/index');
        v.render({
            title: 'Dashboard',
            session: req.session,
        });
    },
    sendBotHTML: async function (req, res) {
        let botId = req.params.botId;
        let botInfo = await BotModel.findOne({bot_id: botId});
        let reqURL = req.header('Referer');
        if(botInfo && reqURL){
            reqURL = this.extractRootDomain(reqURL);
            if (botInfo.site_url.indexOf(reqURL) > -1) {
                return res.sendFile(global.__basedir + '/public/html/' + req.params.botId + '.html');
            } else {
                return res.send('<p class="chat-load-warning">This domain not allowed</p>');
            }
        }else{
            return res.send('<p class="chat-load-warning">Invalid bot information</p>');
        }

    },
    showBots: async function (req, res) {
        let v;
        let botList;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'home/bots');
        botList = await BotModel.find({user_id: req.session.user.user_id});
        v.render({
            title: 'Bot List',
            session: req.session,
            botList: botList
        });
    },
    editBot: async function (req, res) {
        let v, botInfo;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'home/edit');
        let botId = req.params.botId;
        botInfo = await BotModel.findOne({bot_id: botId, user_id: req.session.user.user_id});
        if (botInfo) {
            v.render({
                title: 'Edit Bot',
                session: req.session,
                isEdit: true,// This mean current view is update mode
                botInfo: botInfo,
                config: config,
                error: req.flash('error'),
                success: req.flash('success')
            });
        } else {
            return res.redirect('/*');
        }
    },
    addBot: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'home/edit');
        v.render({
            title: 'Edit Bot',
            session: req.session,
            isEdit: false, // current view is create mode
            config: config,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },
    deleteBot: async function (req, res) {
        let botInfo, botId;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        botId = req.params.botid;
        botInfo = await BotModel.findOne({bot_id: botId, user_id: req.session.user.user_id});
        if (botInfo) {
            await BotModel.deleteOne({bot_id: botId});
        }
        return res.redirect('/bots');
    },
    updateBot: async function (req, res) {
        let botObj, self = this;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        // console.log(req.body);
        if (req.query.mode == 'create') {
            console.log('---Bot Creating---');
            botObj = req.body;
            botObj.bot_id = this.makeID('BT', 10);
            botObj.user_id = req.session.user.user_id;
            botObj.createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            botObj.updatedAt = new Date();
            BotModel.collection.insertOne(botObj, async function (error, response) {
                if (error) {
                    console.log('Error occurred while inserting');
                    req.flash('success', 'Bot Successfully Created');
                    return res.redirect('/add-bot');
                } else {
                    if (await self.makeHTML(response.ops[0])) {
                        let js_content = self.makeScript(response.ops[0]);
                        await BotModel.updateOne({bot_id: botObj.bot_id}, {js_content: js_content});
                        return res.redirect('/gen/' + response.ops[0].bot_id);
                    } else {
                        req.flash('error', "Can't create bot script");
                        return res.redirect('/add-bot');
                    }
                }
            });
        } else {
            console.log('---Bot Updating---');
            let botId = req.query.botid;
            botObj = await BotModel.findOne({bot_id: botId});
            if (botObj) {
                botObj.updatedAt = new Date();
                botObj = Object.assign(botObj, req.body);
                if (this.makeHTML(botObj)) {
                    await botObj.save();
                    botObj.js_content = this.makeScript(botObj);
                    await botObj.save();
                    //await BotModel.updateOne({bot_id: botObj.bot_id}, {js_content: botObj.script_content});
                    req.flash('success', 'Bot Successfully Updated');
                    return res.redirect('/gen/' + botId);
                } else {
                    req.flash('error', "Can't update bot content!");
                    return res.redirect('/gen/' + botId);
                }
            } else {
                return res.redirect('/*');
            }
        }
    },
    generateScript: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let botId = req.params.botId;
        let botInfo = await BotModel.findOne({bot_id: botId});
        if (botInfo) {
            v = new View(res, 'home/generate');
            v.render({
                title: 'Bot Script',
                session: req.session,
                botId: botId,
                script_content: botInfo.js_content,
                error: req.flash('error'),
                success: req.flash('success')
            });
        } else {
            return res.redirect('/*');
        }
    },

    makeHTML: async function (botInfo) {
        //Make HTML
        let siteURL = config.info.site_url;
        let html = '<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <title>Chat Bot</title>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1">\n';
        html += `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">\n`;
        html += `<link rel="stylesheet" href="${siteURL}html/src/css/styles.min.css">\n`;
        html += '</head>\n';
        html += '<body>\n';
        html += '<section id="demo" class="chat-outer-wrapper">\n';
        html += '<style>';
        html += `.chat-window-ctrl { background: ${botInfo.p_color}}`;
        html += `.chat-avatar-img { background: ${botInfo.s_color}}`;
        html += '</style>\n';
        html += '    <div class="vertical-align">\n' +
            '        <div class="chat-card-outer-wrapper">\n' +
            '            <div class="card no-border">\n' +
            '                <div id="chat" class="conv-form-wrapper">\n';
        html += `<form action="${siteURL + 'bot/email/' + botInfo.bot_id }" method="post" id="chat_seven_form" class="hidden" onsubmit="$(\'#convForm\').hide();">`;
        //Main Conversation body
        html += `<input type="text" conv-question="${botInfo.hi}" no-answer="true">\n`;
        html += `                        <select name="Type" conv-question="${botInfo.are_you_our_patient}" answer="value">\n`;

        if (botInfo.customers_accept && botInfo.customers_accept.indexOf('Existing') > -1) {
            html += `                            <option value="ExistingPatient">${botInfo.yes_existing_patient}</option>\n`;
        }

        if (botInfo.customers_accept && botInfo.customers_accept.indexOf('New') > -1) {
            html += `                            <option value="NewPatient">${botInfo.no_new_patient}</option>\n`;
        }

        html += `                            <option value="PatientInquiry">${botInfo.no_learn_more}</option>\n`;
        html += `                        </select>\n`;
        html += `                        <input type="text" name="PatientName" conv-question="${botInfo.what_is_your_name}">\n`;
        html += `                        <input id="telNo" name="PhoneNumber" type="tel" conv-question="${botInfo.what_is_phone}" pattern="[0-9]">\n`;
        html += `                        <input type="email" name="EmailID" conv-question="${botInfo.what_is_your_email}" pattern="@">\n`;
        html += `                        <select name="SubType" conv-question="${botInfo.what_can_i_do_today}">\n` +
            `                            <option value="Appointment">${botInfo.to_book}</option>\n` +
            `                            <option value="LeaveMsg">${botInfo.to_leave_msg}</option>\n` +
            `                            <option value="AskQuestion">${botInfo.to_ask_question}</option>\n` +
            `                        </select>\n` +
            `                        <div conv-fork="SubType">\n` +
            `                            <div conv-case="Appointment">\n` +
            `                                <select name="Date"  conv-question="${botInfo.day_week_schedule}">\n`;

        if (botInfo.opening_days) {
            for (var i = 0; i < botInfo.opening_days.length; i++) {
                html += `<option value="${botInfo.opening_days[i]}">${botInfo.opening_days[i]}</option>\n`;
            }
        } else {
            html += `<option value="Monday">Monday</option>\n`;
        }

        html += `                                </select>\n` +
            `                                <select name="Time" conv-question="${botInfo.what_time_of_day}">\n` +
            `                                    <option value="Morning">Morning</option>\n` +
            `                                    <option value="Afternoon">Afternoon</option>\n` +
            `                                    <option value="Evening">Evening</option>\n` +
            `                                </select>\n` +
            `                                <input type="html" conv-question="${botInfo.noted_summary}\n` +
            `                                    <div></div><div></div>\n` +
            `                                    <!-- {Type}<div></div>-->\n` +
            `                                    <span class='m-bold'>Name</span> : {PatientName}<div></div>\n` +
            `                                    <span class='m-bold'>Email</span> : {EmailID}<div></div>\n` +
            `                                    <span class='m-bold'>Phone</span> : {PhoneNumber}<div></div>\n` +
            `                                    <span class='m-bold'>Preferred Day</span> : {Date}<div></div>\n` +
            `                                    <span class='m-bold'>Preferred Time</span> : {Time}<div></div>" no-answer="true">\n` +
            `                                <select name="MsgConfirm"\n` +
            `                                        conv-question="${botInfo.click_confirm_btn} ${botInfo.we_will_back}"\n` +
            `                                        answer="value">\n` +
            `                                    <option value="2019">Confirm</option>\n` +
            `                                </select>\n` +
            `                            </div>\n` +
            `                        </div>\n` +
            `                        <div conv-fork="SubType">\n` +
            `                            <div conv-case="LeaveMsg">\n` +
            `                                <input type="text" name="TakeDownMessage"\n` +
            `                                       conv-question="${botInfo.please_leave_your_msg}">\n` +
            `                                <input type="html" conv-question="${botInfo.thank_you_got_everything}\n` +
            `                                        <div></div><div></div>\n` +
            `                                        <!-- {Type}<div></div>-->\n` +
            `                                        <span class='m-bold'>Name</span> : {PatientName}<div></div>\n` +
            `                                        <span class='m-bold'>Email</span> : {EmailID}<div></div>\n` +
            `                                        <span class='m-bold'>Contact Number</span> : {PhoneNumber}<div></div>\n` +
            `                                        <span class='m-bold'>Message</span> : {TakeDownMessage}<div></div>" no-answer="true">\n` +
            `                                <select name="MsgConfirm"\n` +
            `                                        conv-question="${botInfo.click_confirm_btn}"\n` +
            `                                        answer="value">\n` +
            `                                    <option value="2035">Confirm</option>\n` +
            `                                </select>\n` +
            `                            </div>\n` +
            `                        </div>\n` +
            `                        <div conv-fork="SubType">\n` +
            `                            <div conv-case="AskQuestion">\n` +
            `                                <input type="text" name="TakeDownQuestionOne"\n` +
            `                                       conv-question="Okay great, how can I help you?">\n` +
            `                                <input type="html" conv-question="${botInfo.thank_you_got_everything}\n` +
            `                                        <div></div><div></div>\n` +
            `                                        <!-- {Type}<div></div>-->\n` +
            `                                        <span class='m-bold'>Name</span> : {PatientName}<div></div>\n` +
            `                                        <span class='m-bold'>Email</span> : {EmailID}<div></div>\n` +
            `                                        <span class='m-bold'>Contact Number</span> : {PhoneNumber}<div></div>\n` +
            `                                        <span class='m-bold'>Question</span> : {TakeDownQuestionOne}<div></div>" no-answer="true">\n` +
            `                                <select name="MsgConfirm"\n` +
            `                                        conv-question="${botInfo.click_confirm_btn}"\n` +
            `                                        answer="value">\n` +
            `                                    <option value="2035">Confirm</option>\n` +
            `                                </select>\n` +
            `                            </div>\n` +
            `                        </div>\n`;
        html += `                        <input type="text" conv-question="${botInfo.thank_you_last_string} If this is urgent, please call our clinic on <a class='m-bold m-phone' href='tel:${botInfo.business_phone}'>${botInfo.business_phone}</a> as this may not be responded to immediately,\n` +
            `                            </br> Have a great day." no-answer="true">`;
        html += `</form>\n` +
            `                </div>\n`;
        html += `<div class="footer-power-by"> Powered by <a href="https://rankdent.com/" target="_blank">RankDent</a></div>\n` +
            `            </div>\n` +
            `        </div>\n` +
            `    </div>\n` +
            `</section>\n`;
        html += `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.3/jquery.min.js"></script>\n`;
        html += `<script src="${siteURL}html/src/js/chat_scripts.js"></script>\n`;
        html += `</body>\n`;
        html += `</html>`;

        let htmlPath = `public/html/${botInfo.bot_id}.html`;

        let htmlExists = await fse.pathExists(htmlPath);
        if (htmlExists) {
            try {
                await fse.remove(htmlPath);
                console.log('success!');
            } catch (err) {
                console.error(err);
                console.log("Can't remove existing html file");
                return false;
            }
        }
        try {
            await fse.outputFile(htmlPath, html);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    makeScript: function (botInfo) {
        let siteURL = config.info.site_url;
        let botName = botInfo.bot_name;
        let botId = botInfo.bot_id;
        let avatarPath = botInfo.avatar_path.substr(1);
        let iconPath = botInfo.icon_path.substr(1);

        let scriptContent = '<script type = "text/javascript">';

        if (botInfo.is_wordpress) {
            scriptContent += '$=jQuery;';
        }
        scriptContent += `var cssResources=["${siteURL}html/src/css/styles.min.css"],botPlaceHolder="${botInfo.reply_text}";jsResources=["${siteURL}html/src/js/chat_scripts.js"],avatarIcon="${siteURL + avatarPath}",bubbleImge="${siteURL + iconPath}",chatBotName="${botName}",jQCheck=function(e,t){"undefined"==typeof jQuery?t>0?(console.log(t),setTimeout(function(){jQCheck(e,t-1)},5)):(console.log("jQuery required to load chat bot so hot loading"),resourceInjector(document,"script","https://www.bots.ekwa.com/js/jquery-1.12.3.min.js",null,e)):e()},uiSetter=function(e,t,s){var a=e;s.match(/^(?:https?:)?(?:\\/\\/)?([^\\/\\?]+)/)[0],s.match(/(?:.+\\/)(.+?)(\\..+)?$/)[1];if(t)a='<a target="_blank" href="'+s+'"><div class="chat-bubble-btn-wrapper chatprompt"><img src="'+avatarIcon+'" alt="Chat Bubble"></div></a>',$("body").append(a),resourceInjector(document,"link",cssResources[0]);else{a='<div class="chat-bubble-btn-wrapper chatprompt js-window-btn-maximize"><img src="'+bubbleImge+'" alt="Chat Bubble"></div><div class="chat-window-wrapper minimized chat-outer-wrapper"> <div class="chat-window-ctrl"> <div class="chat-avatar-img"><img src="'+avatarIcon+'" alt="Chat Bubble"></div> <div class="chat-bot-name"><p>'+chatBotName+'</p></div> <div class="chat-ctrl-btn js-window-btn-minimize active"><i class="fa fa-minus-square"></i></div> </div> <div class="chat-container"> </div></div>';for(var i=0;i<cssResources.length;i++)resourceInjector(document,"link",cssResources[i]);$("body").append(a),$(".chat-container").append(e);for(i=0;i<jsResources.length;i++)resourceInjector(document,"script",jsResources[i])}},resourceInjector=function(e,t,s,a,i){var c=e.createElement(t);(i&&(c.onload=function(){i()}),"script"==t&&(c.async=!0,c.src=s),"link"==t&&(c.href=s,c.rel="stylesheet"),a)?e.getElementsByTagName(a)[0].parentNode.insertBefore(c):e.body.appendChild(c)},sevenInitilaizeChatBoat=function(e,t,s){if("undefined"==typeof jQuery)return jQCheck(function(){sevenInitilaizeChatBoat(e,t)},6),!1;if(t&&null!=t)uiSetter(null,!0,e);else{var a="";$.get(e,function(t){a=t;for(var s=$(a),i=0;i<s.length;i++)if("SECTION"==s[i].nodeName&&"chat-outer-wrapper"==s[i].className&&"demo"==s[i].id){console.log($(a)[i]),a=$(a)[i];break}uiSetter(a,!1,e)})}s&&setTimeout(function(){$(".chat-window-wrapper").removeClass("minimized"),$(".js-window-btn-minimize").removeClass("active")},1e3*s)};sevenInitilaizeChatBoat("${siteURL}bot/src/${botId}",null,10);`;
        scriptContent += '</script>';
        return scriptContent
    },

    sendBotMsg: async function (req, res) {
        console.log(req.params.botId);
        let botInfo = await BotModel.findOne({bot_id: req.params.botId});
        if (botInfo) {
            let to_username = botInfo.business_name;
            let from_email = config.node_mail.mail_account;
            let subject = '';
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    if(key != 'MsgConfirm'){
                        let questionKey = key;
                        let questionValue = req.body[key];
                        if(key == 'Type'){ questionKey = "Submission made by"; }
                        if(key == 'PatientName'){ questionKey = "Name";}
                        if(key == 'PhoneNumber'){ questionKey = "Phone Number";}
                        if(key == 'EmailID'){ questionKey = "Email ID"; }
                        if(key == 'TakeDownQuestionOne'){ questionKey = "Question";}
                        if(key == 'TakeDownMessage'){ questionKey = "Message";}

                        if(questionValue == 'NewPatient'){ questionValue = "New user";}
                        if(questionValue == 'ExistingPatient'){ questionValue = "Existing user";}
                        if(questionValue == 'PatientInquiry'){ questionValue = "User Inquiry";}
                        subject += `<p>${questionKey} : ${questionValue}</p>`;
                    }
                }
            }
            ejs.renderFile("views/email/send-message.ejs",
                {
                    site_url: config.info.site_url,
                    site_name: config.info.site_name,
                    to_username: to_username,
                    from_email: from_email,
                    message_subject: subject
                },
                function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.json({status: 'fail', data: "Can't send message"});
                    } else {

                        let bccList = [];
                        let recvList = botInfo.business_email.split(',');
                        for(let i = 0; i<recvList.length; i++){
                            let tmpRecvEmail = recvList[i].trim();
                            if(tmpRecvEmail.length> 0 || tmpRecvEmail.indexOf('@')>0 ){
                                bccList.push(tmpRecvEmail);
                            }
                        }
                        if(bccList.length == 0) {
                            console.log("Can't find Valid Email List, BotId: "+botInfo.bot_id );
                            return res.json({status: 'fail', data: "Can't find Valid Email List"});
                        }

                        let mailOptions = {
                            from: from_email, // sender address
                            //to: botInfo.business_email, // list of receivers
                            subject: '[' + config.info.site_name + '] ✉ Contact Message ✉', // Subject line, // Subject line
                            text: config.info.site_name + ' ✔', // plaintext body
                            html: data, // html body,
                            bcc: bccList.join(',')
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                return res.json({status: 'fail', data: "Can't send message"});
                            } else {
                                console.log('[' + d.toLocaleString() + '] ', 'Message sent: ' + info.response);
                                return res.json({status: 'success', data: "Can't find bot information"});
                            }
                        });
                    }
                });
        } else {
            return res.json({status: 'fail', data: "Can't find bot information"});
        }
    },

    imageUpload: async function (req, res) {
        let upload_file, fn, ext, dest_fn, imgType;
        upload_file = req.files.file;
        fn = upload_file.name;
        imgType = req.body.imgtype;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        if (ext == 'blob') ext = 'png';
        dest_fn = this.makeID(imgType, 10) + "." + ext;
        upload_file.mv(`public/uploads/${imgType}/${dest_fn}`, async function (err) {
            if (err) {
                console.log('File Uploading Error');
                console.log(err);
                return res.send({status: 'fail', data: 'Image Uploading Error'});
            }
            return res.send({status: 'success', data: `/uploads/${imgType}/${dest_fn}`});
        });
    },

    avatarUpload: async function (req, res) {
        let dataString = req.body.icon_path;
        let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            imageBuffer = {};

        if (matches.length !== 3) {
            return res.send({status: 'fail', data: 'Uploading Error'});
        }

        imageBuffer.type = matches[1];
        imageBuffer.data = Buffer.alloc(matches[2].length, matches[2], 'base64');
        let fileName = this.makeID('AV', 10) + '.png';
        let iconPath = 'public/uploads/icon/' + fileName;

        fs.writeFile(iconPath, imageBuffer.data, function (err) {
            if (err) {
                return res.send({status: 'fail', data: 'File Operation Error'});
            } else {
                return res.send({status: 'success', data: '/uploads/icon/' + fileName});
            }

        });
    },
});
