const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var { registerUser, validateAndLogin, findUser, validateToken ,removeLocal} = require('./user-functions.js');

router.get('/', (req, res) => {
    res.send('Hello User');
});


router.get('/register', (req, res) => {
    res.render('user-folder/register', {
        viewTitle: "Add User"
    });
});

router.get('/login',removeLocal,(req, res) => {
    
    res.render('user-folder/login', {
        viewTitle: "Login"
    });
});

router.post('/register', (req, res) => {
    registerUser(req, res);
});

router.post('/profile', (req, res) => {
    validateAndLogin(req, res)

});

router.get('/user-list', validateToken, (req, res) => {
    if (req.authenticated) {
        findUser({}, req, res);
    } else {
        res.redirect('/login')
    }
});


router.get('/profile', validateToken, (req, res) => {
    if (req.authenticated) {
        res.render('user-folder/home', {
            viewTitle: "Profile",
            userinfo: req.body.user,
        });
    } else {
        res.redirect('/login')
    };
});

router.post('/user-list', validateToken, (req, res) => {
    if (req.authenticated) {
        if (req.body.search && req.body.fullname) {
            var query = {
                fullname: req.body.fullname
            }
            findUser(query, req, res);
        } else {
            findUser({}, req, res);
        };
    } else {
        res.redirect('/login')
    }
});

module.exports = router;