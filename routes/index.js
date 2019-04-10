/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')

router.get('/',(req,res) => {
    res.render('landing');
});


router.get('/register',(req,res)=>{
    res.render('users/register',{page:'register'});
});

router.post('/register', (req,res) => {

    let newUser = req.body.username;

    // eslint-disable-next-line no-unused-vars
    User.register(new User({username:newUser}), req.body.password, (err,newUser) => {

        if(err){
            req.flash('error', err.message)
            return res.redirect('/register');
        }

        passport.authenticate('local')(req,res, ()=>{
            req.flash('success_msg', `Welcome ${newUser.username}`)
            res.redirect('/campgrounds');
        });
            
    });
});


router.get('/login', (req,res) => {

    res.render('users/login',{page:'login'});
});

router.post('/login',passport.authenticate('local',{
    
    successRedirect:'/campgrounds',
    failureRedirect:'/login',
    failureFlash:true
}));

router.get('/logout',(req,res) => {
    
    req.logout();
    req.flash('success_msg', 'Signed out successfuly');
    res.redirect('/login');
});

module.exports = router;