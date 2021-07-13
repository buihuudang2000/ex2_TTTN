//jshint esversion: 6
const express = require('express');
const router = express.Router();

const parentsController = require('../app/controllers/ParentsController');

router.get('/:id', parentsController.showparent);
router.get('/', parentsController.index);

router.post('/', parentsController.insertparent);
router.put('/:id', parentsController.updateparent);
router.delete('/:id', parentsController.deleteparent);

module.exports = router;