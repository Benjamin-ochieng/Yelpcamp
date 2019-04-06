/* eslint-disable no-console */

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

let campgrounds = [
  
    {name: "Nashville Shores", image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "Formerly a KOA, this medium size park is now privately run with a mix of pull through and back in rv spaces and tent camping area. All sites are FHU with cable and picnic table."},
    {name: "Shearin's RV Park", image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "This park doesn't have all the bells and whistles, but it's a terrific little park. We called to inquire about a spot only 5 minutes beforehand. The lady who is the host met us when we pulled in."},
    {name: "Garner State Park", image: "https://images.unsplash.com/photo-1502218808493-e5fd26249efc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "Our rate reflects the camping fee plus the day use fee. We stayed here at the beginning of TX spring break. This is a giant park with hundreds of sites and we managed to get one for one night only. "},
    {name:"Mountain View RV Park", image: "https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "This is a fabulous park and absolutely deserves the 9.6 rating it's received. Beautiful manicured lawn spaces between sites and large trees throughout. "}
]



function seed(){
    Campground.remove({},(err) => {
        if(err){
            console.log(err);
        }else {
           Comment.remove({},(err) => {
               if (err) {
                   console.log(err)
               } else {
                 User.remove({},(err) =>{
                     if (err) {
                       console.log(err); 
                     } else {
                        campgrounds.forEach(campground =>  {
                            Campground.create(campground, (err,newCampground) => {
                                 if (err) {
                                     console.log(err)
                                 } else {
                                     console.log('campground created');
                                     Comment.create({text:'The first comment', author:'Benjamin'},(err,comment)=>{
                                         if (err) {
                                             console.log(err)
                                         } else {
                                             newCampground.comments.push(comment);
                                             newCampground.save();
                                             console.log('comment created')
                                         }
                                     });
                                 }
                            });
                        }); 
                     }
                 });
               }
           });
        }
    });
}

module.exports = seed;

