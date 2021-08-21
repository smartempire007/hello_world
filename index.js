const { response } = require('express');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());

// Require the router we defined in movies.js
const movies = require('./movies.js');

// Use the router on the sub route /movies
app.use('movies', movies);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));