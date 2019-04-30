/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const auth = require('../middleware/index');
const nodeGeocoder = require('node-geocoder');
// const locus = require('locus');

let geocoder = nodeGeocoder({
    provider:'opencage',
    httpAdapter: 'https',
    // eslint-disable-next-line no-undef
    apiKey:process.env.GEOCODER_API_KEY,
    formarter:null
    
});


router.get('/', auth.isLoggedIn, (req,res) => {
   if(req.query.search){
       const regexp = new RegExp(escapeRegex(req.query.search), 'gi');
       Campground.find({name:regexp},(err,foundCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            if (foundCampgrounds.length < 1) {
                req.flash('error_msg', 'No results containing all your search terms were found');
                res.redirect('/campgrounds');
            } else {
              res.render('campgrounds/index', {campgrounds:foundCampgrounds, page:'campgrounds'});
            }
        }
    }) 
   }else {
    Campground.find({},(err,foundCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:foundCampgrounds, page:'campgrounds'});
        }
    })       
}
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
    geocoder.geocode(req.body.location, (err,data)=>{
        if(err){
            req.flash('error_msg', 'Signed out successfuly');
            res.redirect('back');
        }
        console.log(data[0].streetName);
        let lat = data[0].latitude;
        let lng = data[0].longitude;
        let location = data[0].streetName;
        let campground = {name:name, image:image, location:location, lat:lat, lng:lng, price:price, description:description,author}

        // eslint-disable-next-line no-unused-vars
        Campground.create(campground, (err,newCampground) => {
            if(err){
                console.log(err);
            }else {
                res.redirect('/campgrounds');
            }
        })
    });

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


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router
