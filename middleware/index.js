/* eslint-disable no-unused-vars */
const express = require('express');
const passport = require('passport');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const auth = {}


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Please login or Signup to continue' );
    res.redirect("/login");
}


function isCampgroundAuthorized (req,res,next) {
    if (req.isAuthenticated) {
       
        Campground.findById(req.params.id, (err,campground) => {
            if (campground.author.id.equals(req.user.id)) {
                next();
            } else {
                req.flash('error_msg','You are not allowed to do that' );
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        });      
    } else {
        req.flash('error_msg','Please login or Signup to continue' );
        res.redirect('back');
    }
}


function isCommentAuthorized(req,res,next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err,comment)=>{
            if (comment.author.id.equals(req.user.id)) {
                next()
            } else {
                req.flash('error_msg','You are not allowed to do that' );              
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        });
        
    } else {
        req.flash('error_msg','Please login or Signup to continue' );
        res.redirect('/login')
    }
}

auth.isLoggedIn = isLoggedIn;
auth.isCampgroundAuthorized = isCampgroundAuthorized;
auth.isCommentAuthorized = isCommentAuthorized;

module.exports = auth;