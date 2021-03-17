const express = require('express');
const router = express.Router({mergeParams:true});
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review.js');
const Campground = require('../models/campground')
const {validateReview,isLoggedIn} = require('../middleware')


router.post('/',validateReview,isLoggedIn,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));
router.delete('/:reviewId',catchAsync(async (req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted Review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;