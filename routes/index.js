/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
// const locus = require('locus')

router.get('/',(req,res) => {
    res.render('landing');
});


router.get('/register',(req,res)=>{
    res.render('users/register',{page:'register'});
});

router.post('/register', (req,res) => {

    let newUser = new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        profileImage:req.body.profileImage,
    });
    
     if (req.body.adminCode === 'Oracle123') {
         newUser.isAdmin = true;
     }
    // eslint-disable-next-line no-unused-vars
    User.register(newUser, req.body.password, (err,newUser) => {

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


router.get('/users/:id',(req,res) => {
     User.findById(req.params.id, (err,foundUser)=>{
         if (err) {
             req.flash('error_msg',"Something went wrong");
             res.redirect('/');
         }
         res.render('users/show', {user:foundUser});
     });
});


router.get('/follow/:id', (req,res) => {
    User.findById(req.params.id).populate('followers').exec((err,foundUser) =>{
        if (err) {
            req.flash('error_msg',err.message);
            res.redirect('back');            
        }
        let newFollower = req.user._id;
        foundUser.followers.push(newFollower);
        foundUser.save();
        req.flash('success_msg',`You are now following ${foundUser.username}`);
        res.redirect(`/users/${req.params.id}`);
    });
});

module.exports = router;