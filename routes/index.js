//jshint esversion: 6
const siteRouter = require('./site');
const studentRouter = require('./students');
const parentRouter = require('./parents');
const classRouter = require('./class');
function route(app){

    app.use('/students', studentRouter);

    app.use('/class', classRouter);

    app.use('/parents', parentRouter);

    app.use('/', siteRouter);
    
    
}

module.exports = route;