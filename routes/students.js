//jshint esversion: 6
const express = require('express');
const router = express.Router();

const studentsController = require('../app/controllers/StudentsController');

router.get('/getuser', studentsController.getuser);
router.get('/:id', studentsController.showstudent);
router.get('/', studentsController.index);

router.post('/', studentsController.insertstudent);
router.put('/:id', studentsController.updatestudent);
router.delete('/:id', studentsController.deletestudent);

module.exports = router;