//jshint esversion: 6
const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/filter', siteController.filter);
router.get('/sort/:criteria', siteController.sort);

// router.get('/:id', siteController.showstudent);

router.get('/showparent/:id', siteController.showparent);

router.post('/insertclass', siteController.insertclass);

router.post('/insertparent', siteController.insertparent);

router.delete('/delete/:name', siteController.delete);
router.get('/', siteController.index);

module.exports = router;