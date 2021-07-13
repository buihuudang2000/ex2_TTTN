const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Customer = new Schema({
  name: {type: String, maxlength: 255},
  dateOfBirth: {type: String, maxlength: 600},
  gender: {type: String, maxlength: 600}
}, {timestamps: true});

module.exports = mongoose.model('Customer', Customer);