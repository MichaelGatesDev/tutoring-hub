const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create user schema and model
const UserSchema = new Schema({
    userID: {
        type: Number,
        required: true,
        unique: true
    },
    domain: String,
    email: String,
    fullName: String,
    image: String,
    locale: String
});

const User = mongoose.model('user', UserSchema);

module.exports = User;