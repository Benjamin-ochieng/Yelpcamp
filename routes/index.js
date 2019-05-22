/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Campground = require('../models/campground')
const User = require('../models/user');
const Notification = require('../models/notification');
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
     User.findById(req.params.id).populate('followers').exec((err,foundUser)=>{
        if (err) {
            req.flash('error_msg',"Something went wrong");
            res.redirect('/');
        } else {
            Campground.find({'author.id':foundUser.id},(err,foundUser_campgrounds)=>{
                res.render('users/show', {userProfile:foundUser, userCampgrounds:foundUser_campgrounds});
            });
        }
                
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
        foundUser.save(()=>{
         User.findById(newFollower._id).populate('following').exec((err,newFollower)=>{
            if (err) {
                req.flash('error_msg',err.message);
                res.redirect('back');            
            }
        newFollower.following.push(foundUser.id);
        newFollower.save();

        req.flash('success_msg',`You are now following ${foundUser.username}`);
        res.redirect(`/users/${req.params.id}`);           
         });  
            
        });
    });
});

router.get('/notifications', (req,res)=>{
    User.findById(req.user._id).populate('notifications').exec((err,foundUser)=>{
        if (err) {
            req.flash('error_msg',err.message);
            res.redirect('back'); 
        } else {
            res.render('users/notifications', {notifications:foundUser.notifications})
        }       
    });
});

router.get('/notifications/:id', (req,res)=>{
  
     Notification.findById(req.params.id).populate().exec((err,notification) =>{
         if (err) {
            req.flash('error_msg',err.message);
            res.redirect('back')   
         }
         notification.isRead = true;
         notification.save();
         res.redirect(`/campgrounds/${notification.campgroundId}`);
     });
});

module.exports = router;