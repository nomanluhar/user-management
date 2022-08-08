var express = require('express');
var app = express();
var cookieParser = require("cookie-parser");

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = mongoose.model('UserData');
const { sign, verify } = require('jsonwebtoken');
var { validateUser, validateLoginUser } = require('./user.validator.js');

app.use(cookieParser());
app.use(express.json());

var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

var registerUser = function (req, res) {
    User.findOne({ email: req.body.email }, (err, response) => {
        if (response) {
            req.body['emailError'] = `User is already registered with ${req.body.email}`;
            res.render('user-folder/register', {
                viewTitle: "Add User",
                userinfo: req.body
            });
        } else {
            saveUser(req, res)
        }
    });
};

var saveUser = async function (req, res) {
    var validateData = {
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname
    };
    validateData = validateUser(validateData);
    if (validateData.error) {
        handleValidation(validateData.error.details, req.body);
        res.render('user-folder/register', {
            viewTitle: "Add User",
            userinfo: req.body
        });
    } else {
        var newUser = new User();
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(req.body.password, salt);
        newUser.phoneNum = req.body.phoneNum;
        newUser.dob = req.body.dob;
        newUser.save((err, result) => {
            if (err) {
                console.log('Error during data save : ' + err);
            } else {
                res.redirect('/login');
            }
        });
    };
};

var validateAndLogin = async function (req, res) {
    var validateData = {
        email: req.body.email,
        password: req.body.password,
    };
    validateData = validateLoginUser(validateData);
    if (validateData.error) {
        handleValidation(validateData.error.details, req.body);
        res.render('user-folder/login', {
            viewTitle: "Login",
            userinfo: req.body
        });
    } else {
        var findUser = await User.findOne({ email: req.body.email });
        if (findUser) {
            bcrypt.compare(req.body.password, findUser.password, (err, data) => {
                if (err) throw err

                if (data) {
                    const accessToken = createToken(findUser);

                    localStorage.setItem('accessToken', accessToken);

                    res.render('user-folder/home', {
                        viewTitle: "Profile",
                        userinfo: findUser,
                        token: accessToken
                    });

                } else {
                    req.body['passwordError'] = 'Incorrect password'
                    res.render('user-folder/login', {
                        viewTitle: "Login",
                        userinfo: req.body
                    });
                };
            });
        } else {
            req.body['emailError'] = 'User is not registered'
            res.render('user-folder/login', {
                viewTitle: "Login",
                userinfo: req.body
            });
        };
    };
};

var handleValidation = function (err, body) {
    for (field in err) {
        switch (err[field].context.key) {
            case 'fullname':
                body['fullnameError'] = err[field].message;
                break;
            case 'email':
                body['emailError'] = err[field].message;
                break;
            case 'password':
                body['passwordError'] = err[field].message;
                break;
            default:
                break;
        };
    };
};


var findUser = function (query, req, res) {
    User.find(query, (err, response) => {
        if (err) {
            console.log(`Error while getting users data`)
        } else {
            res.render('user-folder/users', {
                viewTitle: "All user list",
                users: response
            });
        };
    });
};

var createToken = function (user) {
    const accessToken = sign({ user }, "secretkey");

    return accessToken;
}

var validateToken = function (req, res, next) {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
        console.log('Unuthenticate User Please Log in again ')
        return res.redirect('/login')
    };

    try {
        const validToken = verify(accessToken, "secretkey");
        if (validToken) {
            req.authenticated = true;
            req.body.user = validToken.user;
            console.log('Authenticate User')
            return next();
            // return res.redirect('/login')

        }
    } catch {
        console.log('Unuthenticate User Please Log in again ')
        return res.redirect('/login')
    };
};

var removeLocal = function (req,res,next) {
    localStorage.removeItem('accessToken');
    return next();
}
module.exports = { registerUser, validateAndLogin, findUser, validateToken ,removeLocal}