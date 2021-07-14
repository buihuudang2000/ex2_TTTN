//jshint esversion: 6
const Student = require('../models/Student');
const Class = require('../models/Class');
const Parent = require('../models/Parent');

const mongoose= require('mongoose');
const Schema = mongoose.Schema;

class StudentsController{
    //GET /students/getuser?name&creat_at&update_at&class&sort&typesort=asc||desc
    getuser( req, res){
        const filter_value= {$or: [
            {name: req.query.name},
            {createdAt: (req.query.create)? new Date(req.query.create): undefined},
            {class_id: (req.query.class)? mongoose.Types.ObjectId(req.query.class): undefined},
            {updatedAt: (req.query.update)? new Date(req.query.update): undefined}]
        };
       
        let valsort={};
        valsort[ req.query.sort]=req.query.typesort;

        Student.find(filter_value).sort(valsort).exec((err, result) => {
            if (!err) res.json(result);
            else
            res.status(400).json({error: 'ERROR!!!'});
        });
    }
    //GET /students/
    index(req,res){
       
        let perPage=10, Page;
        if (req.query.page) Page=Number(req.query.page); else Page=1;
        Student.find({})
        .populate('class_id')
        .skip(perPage*(Page-1))
        .limit(perPage)
        .then(data=>{
            res.json(data);
        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!' + err});
        });
        
    }

    //Get /student/:id
    showstudent(req,res){
        Student.find({ID: req.params.id})
        .populate('class_id')
        .then(data=>{
            res.json(data);
        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!' + err});
        });
        
    }

    // POST /student
    insertstudent(req,res){
        console.log(req.body);
        if (!(req.body.id && req.body.name && req.body.date && req.body.gender )) {
            res.status(400).json({error: 'ERROR!!!'});
            return;
        }

        Student.find({ID: req.body.id}).then(data=> {
            if (data.length != 0) {
                // console.log(data);
                // console.log(data.length);
                res.status(400).json({msg: 'Data Exists'});
                return 0;
            } else return 1;
        }).then(data =>{
        // console.log(data);
        if (data == 1) {
            const student = new Student({
                ID: req.body.id,
                name: req.body.name, 
                dateOfBirth: new Date(req.body.date), 
                gender: req.body.gender
            });
            
            student.save(function(err) {
                if (err) res.status(400).json({error: 'ERROR2!!!'});
                else res.status(200).json({msg: 'Inserted a student'});
            });
        }

        });

        
    }

    

    updatestudent(req, res){

        function de_up_class(data1, data2) {
            //console.log(data2);
            
            let id = data2[0]._id;
            data2[0].class_id.forEach(element => {
                //console.log(element);
                Class.findOne({_id: element})
                    .then(data => {
                        console.log(data);
                        let student_new=[];
                        for (let index=0; index < data.student_id.length; index++){
                            
                            if (id.toString() != data.student_id[index].toString()) student_new.push(data.student_id[index]);
                        }
                        data.student_id = student_new;
                        //console.log(data);
                        Class.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
    
                        // data.class_id.push(class1._id);
                        // console.log(data); 
                        // Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                    
                    })
                    .catch(err => {console.log("Fail");});
            });
            
            setTimeout(() =>{
                data1.class_id.forEach(element => {
                    //console.log(element);
                    Class.findOne({_id: element})
                        .then(data => {
                            console.log(data);
                            
        
                            data.student_id.push(id);
                            //console.log("After");
                            //console.log(data); 
                            Class.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                        
                        })
                        .catch(err => {console.log("Fail");});
                });
            },100);
            
    
        };

        const student = {
            ID: req.body.id,
            name: req.body.name,
            gender: req.body.gender,
            class_id: []
        };

       
        req.body.class_id.map( data => { 
            return student.class_id.push(mongoose.Types.ObjectId(data)) ;
        } );

        
        //console.log(student);

        Student.find({ID: req.params.id})
        .then(data => {
            //console.log(data);
            if (data.length > 0) {
                
                // console.log(student.class_id.toString());
                // console.log(data[0].class_id.toString());
                // Neu class_id tha doi thi cap nhap lai class collection

                if (student.class_id.toString() != data[0].class_id.toString()) {
                    
                    de_up_class(student, data);
                    
                };

                
            } 

            Student.updateOne({ID: req.params.id}, student, (err, result) =>{
            if (err) res.status(400).json({error: 'ERROR!!!'});
            else res.status(200).json({msg: 'Updated a record'});
            });

        })
        .catch(err => {
            res.status(400).json({error: 'ERROR!!!'});
        });
           
            
        

        
        

    }

    deletestudent(req, res){
        
        
        function delete_studentInClass(std_item) {

            std_item.class_id.forEach(element => {
                Class.findOne({_id: element})
                    .then(data => {
                        console.log(data);
                        let student_new=[];
                        for (let index=0; index < data.student_id.length; index++){
                            
                            if (std_item._id.toString() != data.student_id[index].toString()) student_new.push(data.student_id[index]);
                        }
                        data.student_id = student_new;
                        console.log(data);
                        Class.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
    
                        // data.class_id.push(class1._id);
                        // console.log(data); 
                        // Student.replaceOne({_id: element},data).catch(err => {console.log("Fail replace");});
                    
                    })
                    .catch(err => {console.log("Fail");});
            });
          
        }

        function delete_studentInParent(std_item){
            Parent.find({children_id: std_item._id})
            .then(data =>{
                Parent.updateOne({ID: 4},{children_id: undefined}).catch(err => {console.log("Fail replace");});
                
            })
            .catch(err => {console.log("Fail");});

        }

        Student.findOne({ID: req.params.id})
        .then(data => {
            delete_studentInClass(data);
            delete_studentInParent(data);
        })
        .catch(err => {console.log("Fail");});

        Student.deleteOne({ID: req.params.id}, (err, result) =>{
            if (err) res.status(400).json({error: 'ERROR!!!'});
            else res.status(200).json({msg: 'Deleted a record'});
        });
        

    }

}

module.exports = new StudentsController;
