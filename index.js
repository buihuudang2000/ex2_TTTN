//jshint esversion: 6
const express= require('express');
const app= express();

const path = require('path');
const port = 3000;

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname, 'resources/views'));

const route = require('./routes/index');
const db = require('./config/db');

app.use(express.json());

db.connect();

route(app);


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

