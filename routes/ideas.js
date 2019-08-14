const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas')

// Idea Index Page
router.get('/', (req, res)=>{
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas =>{
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//Process Form
router.post('/',(req, res)=>{
    let errors =[];
    if(!req.body.title){
        errors.push({text: 'Please add a title'})
    }
    if(!req.body.details){
        errors.push({text: 'Please add a same details'})
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newuser = {
            title: req.body.title,
            details: req.body.details

        }
        new Idea(newuser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea add');
                res.redirect('/ideas');
            })
    }
})

//Add Idea Form
router.get('/add', (req, res)=>{
    res.render('ideas/add');
});

//E$dit Idea Form
router.get('/edit/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit',{
                idea:idea
            } );
        });
});

//Edit Form Process
router.put('/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea =>{
            req.flash('success_msg', 'Video idea update');
            res.redirect('/ideas');
        })
    })
});

//Delete Idea
router.delete('/:id', (req, res)=>{
    Idea.deleteOne({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    })
});


module.exports = router;