/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const auth = require('../middleware/index')


router.get('/', auth.isLoggedIn, (req,res) => {

    Campground.find({},(err,foundCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:foundCampgrounds, page:'campgrounds'});
        }
    })
});

router.get('/new',auth.isLoggedIn,(req,res) => {
    res.render('campgrounds/new');
});

router.post('/',auth.isLoggedIn,(req,res) => {

    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let description = req.body.description;
    let author = {
         id:req.user.id,
         username:req.user.username
    }

    let campground = {name:name, image:image, price:price, description:description,author}

    // eslint-disable-next-line no-unused-vars
    Campground.create(campground, (err,newCampground) => {
        if(err){
            console.log(err);
        }else {
            res.redirect('/campgrounds');
        }
    })
});



router.get("/:id", auth.isLoggedIn, function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


router.get('/:id/edit', auth.isCampgroundAuthorized, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if (err) {
            console.log(err)
        } else {
           res.render('campgrounds/edit', {campground:campground});
        }
    });
});


router.put('/:id', auth.isCampgroundAuthorized, (req,res) => {
    // eslint-disable-next-line no-unused-vars
    Campground.findByIdAndUpdate({_id:req.params.id}, req.body.campground,(err,updatedCampground) => {
        if(err){
            console.log('err');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});


router.delete('/:id',auth.isCampgroundAuthorized, (req,res) => {
    Campground.findById(req.params.id,(err,campground) => {
        Comment.remove({'_id':{ $in:campground.comments}},(err)=>{
            if(err) console.log(err);
            campground.remove();
            res.redirect('/campgrounds');
        });
    });
});


module.exports = router
