const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({       // here, we schema only for the "email", because 'passport-local-mongoose' by default defining the username, password, hash and salt-string.
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);   // here, we must plugin the 'passport-local-mongoose' because by default it genrate the username & hash-password.

module.exports = mongoose.model('User', userSchema);