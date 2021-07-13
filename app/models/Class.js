//jshint esversion: 6
const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const Class= new Schema({
    ID:{type: Number, unique: true},
    name: {type: String, maxlenght: 255},
    student_id: [{type: Schema.Types.ObjectId, ref: 'Student'}]
}, {timestamps: true});

module.exports = mongoose.model('Class', Class);