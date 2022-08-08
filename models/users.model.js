const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: 'This field is required',
    },
    email: {
        type: String,
        required: 'This field is required',
    },
    password: {
        type: String,
        required: 'This field is required',
    },
    phoneNum: {
        type: String,
    },
    dob: {
        type: String,
    },
});

mongoose.model('UserData', userSchema);
