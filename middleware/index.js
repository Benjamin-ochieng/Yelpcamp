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
            if (err || campground === undefined) {
                req.flash('err_msg','Sorry, that campground does not exist');
                res.redirect('/back');
            } else {

                if (campground.author.id.equals(req.user._id) || req.user && req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error_msg','You are not allowed to do that' );
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
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
          if (err || comment === undefined) {
              req.flash('err_msg','Sorry the comment does not exist')
          } else {
            if (comment.author.id.equals(req.user.id) || req.user && req.user.isAdmin) {
                next()
            } else {
                req.flash('error_msg','You are not allowed to do that' );              
                res.redirect(`/campgrounds/${req.params.id}`);
            }
          }
        });
        
    } else {
        req.flash('error_msg','Please login or Signup to continue' );
        res.redirect('/login')
    }
}

function hasNotReviewed(req,res,next){
  if (req.isAuthenticated) {
      Campground.findById(req.params.id).populate('comments').exec((err,campground)=>{
          if (err) {
              req.flash('error_msg', err.message);
          } else {
              if (campground.comments.some(comment => comment['author'].id.equals(req.user.id)) ) {
                req.flash('error_msg','You have already reviewed this campground' );              
                res.redirect(`/campgrounds/${req.params.id}`);           
              } else {
                next()
              }
          }
      });
  } else {
    req.flash('error_msg','Please login or Signup to continue' );
    res.redirect('/login');  
  }
}

auth.isLoggedIn = isLoggedIn;
auth.isCampgroundAuthorized = isCampgroundAuthorized;
auth.isCommentAuthorized = isCommentAuthorized;
auth.hasNotReviewed = hasNotReviewed;

module.exports = auth;