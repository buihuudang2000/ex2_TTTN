//jshint esversion: 6
const Student = require('../models/Student');
const Class = require('../models/Class');
const Parent = require('../models/Parent');

const mongoose= require('mongoose');
const Schema = mongoose.Schema;

class SiteController{
    // GET localhost/
    index( req, res){
        
        Student.find({}).sort({dateOfBirth:1}).exec((err, result) => {
            if (!err) res.json(result);
            else
            res.status(400).json({error: 'ERROR!!!'});
        });
    }
    // GET localhost/sort/:criteria
    sort( req, res){
        let crit= req.params.criteria;
        Student.find({}).sort({dateOfBirth:crit}).exec((err, result) => {
            if (!err) res.json(result);
            else
            res.status(400).json({error: 'ERROR!!!'});
        });
    }
    
    // POST /insertclass
    insertclass(req,res){
        
        if (!(req.query.id && req.query.name  )) {
            res.status(400).json({error: 'ERROR!!!'});
            return;
        }

        Class.find({ID: req.query.id}).then(data=> {
            if (data.length != 0) {
                // console.log(data);
                // console.log(data.length);
                res.status(400).json({msg: 'Data Exists'});
                return 0;
            } else return 1;
        }).then(data =>{
        // console.log(data);
        if (data == 1) {
        
            const class1 = new Class({
                ID: req.query.id,
                name: req.query.name, 
                student_id: []
            });

            if (req.query.count){
                let temp= [];
                let count=3;
                for (let ele in req.query){
                    count--;
                    if (count<0) temp.push(mongoose.Types.ObjectId(req.query[ele]));
                }
                
                class1.student_id=temp;
            }
            
            //Student.replaceOne({ID: 1},{class_id: [1]}).catch(err => {console.log("Failup");});
            class1.student_id.forEach(element => {
                
                Student.findOne({_id: element})
                    .then(data => {
                        data.class_id.push(class1._id);
                        console.log(data); 
                        Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                    
                    })
                    .catch(err => {console.log("Fail");});
            });

            class1.save(function(err) {
                if (err) res.status(400).json({error: 'ERROR2!!!'});
                else res.status(200).json({msg: 'Inserted a class'});
            });

            
        }

    });

            
    }
    //Delete /delete/:name
    delete(req,res){
        Student.deleteMany({name: req.params.name},(err, result) => {
            if (!err) res.json(result);
            else
            res.status(400).json({error: 'ERROR!!!'});
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
        Student.aggregate([{ $match: { ID: Number(req.params.id) } },{$lookup : { from: 'parents', localField: '_id', foreignField: 'children_id', as: 'parent' }}])
        .exec((err,data)=>{
            if (err) res.status(400).json({error: 'ERROR!!!' + err});
            else res.json(data);
        });

    }
    //Get /filter
    filter(req,res){
        const filter_value= {$or: [
            {createdAt: new Date(req.query.create)},
            {class_id: mongoose.Types.ObjectId(req.query.class)},
            {updatedAt: new Date(req.query.update)}]
        };
        console.log(filter_value);
        Student.find(filter_value)
        .populate('class_id')
        .then(data=>{
            res.json(data);
        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!' + err});
        });
        
    }

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
                if (err) res.status(400).json({error: 'ERROR2!!!'});
                else res.status(200).json({msg: 'Inserted a class'});
            });

            
        }

        });

        
        
    }
}

module.exports = new SiteController;