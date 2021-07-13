//jshint esversion: 6
const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const Student= new Schema({
    ID: {type: Number, unique: true, index: true},
    name: {type: String, maxlenght: 255},
    dateOfBirth: {type: Date, default: Date.now()},
    gender: {type: String, maxlenght: 10},
    class_id: [{type: Schema.Types.ObjectId, ref: 'Class'}],
    

}, {timestamps: true});

module.exports = mongoose.model('Student', Student);