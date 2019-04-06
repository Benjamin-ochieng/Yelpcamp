/* eslint-disable no-console */
const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const auth = require('../middleware/index')



router.get('/comments/new', auth.isLoggedIn,(req,res) => {
    let campground = req.params.id;
    
    Campground.findById(campground,(err,foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground:foundCampground});

        }
    });
});

router.post('/',auth.isLoggedIn,(req,res) => {
    let campground = req.params.id;
    let comment = req.body.comment;
 
    Campground.findById(campground,(err,foundCampground) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            res.redirect(`/campgrounds${campground}`);
            
        } else {
            Comment.create(comment,(err, newComment) => {
                if (err) {
                    console.log(err);
                    req.flash('error', err.message);
                    res.redirect(`/campgrounds${campground}`);
                } else {
                    newComment.author.id = req.user.id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    req.flash('success_msg','Comment added');
                    res.redirect(`/campgrounds/${campground}`)
                }
            });

        }
    });
});

router.get('/comments/:comment_id/edit',auth.isCommentAuthorized, (req,res) => {
    Comment.findById(req.params.comment_id, (err,comment) => {
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
           res.render('./comments/edit',{campground_id:req.params.id, comment:comment});            
        }
    })
});

router.put('/comments/:comment_id', auth.isCommentAuthorized, (req,res) => {
    // eslint-disable-next-line no-unused-vars
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);            
        }
    });
});


router.delete('/comments/:comment_id',auth.isCommentAuthorized,(req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect('back');
            console.log(err)
        }
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});


module.exports = router;