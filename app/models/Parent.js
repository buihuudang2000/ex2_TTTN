//jshint esversion: 6
const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const Parent= new Schema({
    ID: {type: Number, unique: true},
    name: {type: String, maxlenght: 255},
    children_id: Schema.Types.ObjectId
  

}, {timestamps: true});

module.exports = mongoose.model('Parent', Parent);