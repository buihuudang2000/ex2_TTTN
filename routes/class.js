//jshint esversion: 6
const express = require('express');
const router = express.Router();

const classController = require('../app/controllers/ClassController');

router.post('/',  classController.insertclass);
router.get('/:id', classController.showclass);
router.get('/', classController.index);
router.put('/:id', classController.updateclass);
router.delete('/:id', classController.deleteclass);



module.exports = router;