//jshint esversion: 6
const Student = require('../models/Student');
const Class = require('../models/Class');
const Parent = require('../models/Parent');

const mongoose= require('mongoose');
const Schema = mongoose.Schema;

class ClassController{

    //GET /Class/
    index(req,res){
        let perPage=10, Page;
        if (req.query.page) Page=Number(req.query.page); else Page=1;
        Class.find({})
        .skip(perPage*(Page-1))
        .limit(perPage)
        .then(data=>{
            res.json(data);
        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!' + err});
        });
        
    }

    //Get /class/:id
    showclass(req,res){
        Class.find({ID: req.params.id})
        .then(data=>{
            res.json(data);
        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!' + err});
        });
        
    }

    // POST /insertclass
    insertclass(req,res){
        
        if (!(req.body.id && req.body.name  )) {
            res.status(400).json({error: 'ERROR!!!'});
            return;
        }

        Class.find({ID: req.body.id}).then(data=> {
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
                ID: req.body.id,
                name: req.body.name, 
                student_id: []
            });

            if (req.body.count){
                let temp= [];
                let count=3;
                for (let ele in req.body){
                    count--;
                    if (count<0) temp.push(mongoose.Types.ObjectId(req.body[ele]));
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

    updateclass(req, res){

        function de_up_student(data1, data2) {
            //console.log(data2);
            
            let id = data2[0]._id;
            data2[0].student_id.forEach(element => {
                //console.log(element);
                Student.findOne({_id: element})
                    .then(data => {
                        console.log(data);
                        let class_new=[];
                        for (let index=0; index < data.class_id.length; index++){
                            
                            if (id.toString() != data.class_id[index].toString()) class_new.push(data.class_id[index]);
                        }
                        data.class_id = class_new;
                        console.log(data);
                        Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
    
                        // data.class_id.push(class1._id);
                        // console.log(data); 
                        // Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                    
                    })
                    .catch(err => {console.log("Fail");});
            });
            
            setTimeout(() =>{
                data1.student_id.forEach(element => {
                    //console.log(element);
                    Student.findOne({_id: element})
                        .then(data => {
                            console.log(data);
                            
        
                            data.class_id.push(id);
                            //console.log("After");
                            //console.log(data); 
                            Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                        
                        })
                        .catch(err => {console.log("Fail");});
                });
            },100);
            
    
        };

        const class1 = {
            ID: req.body.id,
            name: req.body.name,
            student_id: []
        };

       
        req.body.student_id.map( data => { 
            return class1.student_id.push(mongoose.Types.ObjectId(data)) ;
        } );

        
        //console.log(student);

        Class.find({ID: req.params.id})
        .then(data => {
            //console.log(data);
            if (data.length > 0) {
                
                // console.log(student.class_id.toString());
                // console.log(data[0].class_id.toString());
                // Neu class_id tha doi thi cap nhap lai class collection

                if (class1.student_id.toString() != data[0].student_id.toString()) {
                    
                    de_up_student(class1, data);
                    
                };

                
            } 

            Class.updateOne({ID: req.params.id}, class1, (err, result) =>{
            if (err) res.status(400).json({error: 'ERROR!!!'});
            else res.status(200).json({msg: 'Updated a record'});
            });

        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!'});
        });
           
            
        

        
        

    }

    deleteclass(req, res){
        
        
        function delete_studentInStudent(cls_item) {

            cls_item.student_id.forEach(element => {
                Student.findOne({_id: element})
                    .then(data => {
                        console.log(data);
                        let class_new=[];
                        for (let index=0; index < data.class_id.length; index++){
                            
                            if (cls_item._id.toString() != data.class_id[index].toString()) class_new.push(data.class_id[index]);
                        }
                        data.class_id = class_new;
                        console.log(data);
                        Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
    
                        // data.class_id.push(class1._id);
                        // console.log(data); 
                        // Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                    
                    })
                    .catch(err => {console.log("Fail");});
            });
          
        }

        Class.findOne({ID: req.params.id})
        .then(data => {
            delete_studentInStudent(data);
        })
        .catch(err => {console.log("Fail");});

        Class.deleteOne({ID: req.params.id}, (err, result) =>{
            if (err) res.status(400).json({error: 'ERROR!!!'});
            else res.status(200).json({msg: 'Deleted a record'});
        });
        

    }

}

module.exports = new ClassController;
