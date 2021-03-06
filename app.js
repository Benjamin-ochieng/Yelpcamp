require('dotenv').config()
/* eslint-disable no-console */
const express = require('express');
const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash  = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// eslint-disable-next-line no-unused-vars
const Campground = require('./models/campground');
// eslint-disable-next-line no-unused-vars
const Comment = require('./models/comment');
const User = require('./models/user');
// eslint-disable-next-line no-unused-vars
const seed = require('./seed');
const moment = require('./libs/moment');


mongoose.set('useFindAndModify', false);
// eslint-disable-next-line no-undef
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true } );
// mongoose.connect('mongodb+srv://BENJAMIN-OCHIENG:Lcdescfmp4DWZ8Hj@yelpcamp-hacx1.mongodb.net/yelp_camp?retryWrites=true',{ useNewUrlParser: true } );
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended: true}));
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + '/public'));



app.use(session({
      secret:"You will never walk alone",
      resave:false,
      saveUninitialized:false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req,res,next) => {
  res.locals.user = req.user;
  if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log(err.message);
    }
   }

    res.locals.moment = moment;
    res.locals.error = req.flash('error');
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


const indexRoutes      = require('./routes/index');
const campgroundRoutes = require('./routes/campground');
const commentRoutes    = require('./routes/comment');

// seed();

app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id',commentRoutes);


// eslint-disable-next-line no-unused-vars


app.listen(port,()=>{

        console.log(`Our app has started and is running on https://localhost:${port}`);
});
