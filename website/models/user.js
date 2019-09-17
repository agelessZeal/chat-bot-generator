let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    user_id:String,
    username:String,
    email:String,
    password:String,
    avatar_path:String,
    role:String, // admin or users,
    last_login:String,
    createdAt:String,
    token:String
});

module.exports = mongoose.model('user', UserSchema);
