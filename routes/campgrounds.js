const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');


router.get('/',isLoggedIn,catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}));
router.get('/makecampground',catchAsync(async(req,res)=>{
    const camp = new Campground({title:'My Backyard',description:'cheap camping!'});
    await camp.save();
    res.send(camp)
}));
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})
router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{
    const campground = await Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
    
}))
router.get('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const campground = await (Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author'));
    console.log(campground);
    if(!campground){
        req.flash('error','Cannot find that Campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}));
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find that Campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});

}));
router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const camp =  await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully updated Campground!');
    res.redirect(`/campgrounds/${camp._id}`)
}));
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground!');
    res.redirect('/campgrounds')
}));

module.exports = router;