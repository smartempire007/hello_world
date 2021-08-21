var express = require('express');
var app = express();

// var things = require('./things.js');

// both index.js and things.js should be in same directory
// app.use('/things', things);
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/components', (req, res) => {
    res.render('public'
        //name: "SmartEmpire",
        //age: 32,
       // signUp: "http://www.smartempire.com"
    );
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));