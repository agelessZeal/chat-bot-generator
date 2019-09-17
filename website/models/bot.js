let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BotSchema = new Schema({
    bot_id: String,
    user_id: String,
    business_name: String,
    business_phone : String,
    business_email: String, /// multiple emails
    bot_name: String,
    avatar_type: Number, // admin or users, '5' => custom avatar,
    site_url: String,
    opening_days : Array, //Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    customers_accept: Array , //Existing , New
    p_color: String,
    s_color: String,
    avatar_path: String,
    icon_path:String,
    html_path: String,
    js_content: String,
    is_wordpress:Boolean,
    with_us: String,
    ////Chat Text fields
    reply_text: String, // Type Here / Select Option from Above
    hi:String,
    are_you_our_patient:String,
    yes_existing_patient:String,
    no_new_patient:String,
    no_learn_more:String,
    what_is_your_name:String,
    what_is_phone:String,
    what_is_your_email:String,
    what_can_i_do_today:String,
    to_book:String,
    to_leave_msg:String,
    to_ask_question:String,
    day_week_schedule:String,
    what_time_of_day:String,
    msg_confirm:String,
    please_leave_your_msg:String,
    how_can_i_help:String,
    click_confirm_btn:String,
    we_will_back : String,
    noted_summary:String,
    thank_you_got_everything:String,
    thank_you_last_string:String,
    ////
    createdAt: String,
    updatedAt: Date
});

module.exports = mongoose.model('bot', BotSchema);
