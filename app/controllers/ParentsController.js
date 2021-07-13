//jshint esversion: 6
const Student = require('../models/Student');
const Class = require('../models/Class');
const Parent = require('../models/Parent');

const mongoose= require('mongoose');
const Schema = mongoose.Schema;

class ParentsController{

    //GET /Class/
    index(req,res){
        let perPage=10, Page;
        if (req.query.page) Page=Number(req.query.page); else Page=1;
        Parent.find({})
        .skip(perPage*(Page-1))
        .limit(perPage)
        .then(data=>{
            res.json(data);
        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!' + err});
        });
        
    }

    //Get /showparent/:id
    showparent(req,res){
        // Parent.aggregate([{$group : {_id : '$name'}}])
        // Parent.aggregate([{$group : {_id : '$name'}}])
        // .exec((err,data)=>{
        //     if (err) res.status(400).json({error: 'ERROR!!!' + err});
        //     else res.json(data);
        // });

        Parent.aggregate([{ $match: { ID: Number(req.params.id) } },{$lookup : { from: 'students', localField: 'children_id', foreignField:'_id' , as: 'children' }}])
        .exec((err,data)=>{
            if (err) res.status(400).json({error: 'ERROR!!!' + err});
            else res.json(data);
        });

        // Student.aggregate([{ $match: { ID: Number(req.params.id) } },{$lookup : { from: 'parents', localField: '_id', foreignField: 'children_id', as: 'parent' }}])
        // .exec((err,data)=>{
        //     if (err) res.status(400).json({error: 'ERROR!!!' + err});
        //     else res.json(data);
        // });

    }

    // POST /insertparent
    insertparent(req, res){

        if (!(req.body.id && req.body.name && req.body.children)) {
            res.status(400).json({error: 'ERROR!!!'});
            return;
        }

        Parent.find({ID: req.body.id}).then(data=> {
            if (data.length != 0) {
                // console.log(data);
                // console.log(data.length);
                res.status(400).json({msg: 'Data Exists'});
                return 0;
            } else return 1;
        }).then(data =>{
        // console.log(data);
        if (data == 1) {
        
            const parent = new Parent({
                ID: req.body.id,
                name: req.body.name, 
                children_id: mongoose.Types.ObjectId(req.body.children)
            });

            parent.save(function(err) {
                if (err) res.status(400).json({error: 'ERROR!!!'});
                else res.status(200).json({msg: 'Inserted a record'});
            });

            
        }

        });
        
    }

    updateparent(req, res){

        const parent = {
            ID: req.body.id,
            name: req.body.name, 
            children_id: mongoose.Types.ObjectId(req.body.children)
        };
        console.log(parent);
        Parent.updateOne({ID: req.params.id}, parent, (err, result) =>{
            if (err)  res.status(400).json({error: 'ERROR!!!' + err});
            else res.status(200).json({msg: 'Updated a record'});
        });
        

    }

    deleteparent(req, res){

        Parent.deleteOne({ID: req.params.id}, (err, result) =>{
            if (err) res.status(400).json({error: 'ERROR!!!'});
            else res.status(200).json({msg: 'Deleted a record'});
        });
        

    }

}

module.exports = new ParentsController;