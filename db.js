const { response } = require('express');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

app.set('view engine', 'pug');
app.set('views', './views');


mongoose.connect('mongodb://localhost/my_db', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to Database")) 
.catch(err => console.error("An error has occured", err));

var personSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String,
});
var Person = mongoose.model("person", personSchema);



app.get('/person', (req, res) => {
   res.render('form');
   Person.find((err, response) => {
      res.json(response);
   });
});

// Person  .updateMany({age: 25}, {nationality: "American"}, function(err, response){
//    console.log(response);
// });

// Person.findOne(
//    {name: "James"},
//    {age: 40},
//    function(err, response){
//       console.log(response)
//    });

// app.put('/people/:id', function(req, res){
//    Person.findByIdAndUpdate(req.params.id, req.body, function(err, response){
//       if(err) res.json({message: "Error in updating person with id " + req.params.id});
//       res.json(response);
//    });
// });

app.delete('/people/:id', function(req, res){
   Person.findByIdAndRemove(req.params.id, function(err, response){
      if(err) res.json({message: "Error in deleting record id " + req.params.id});
      else res.json({message: "Person with id " + req.params.id + " removed."});
   });
});



app.post('/person', (req, res) => {
   var personInfo = req.body; //Get the parsed information

   if(!personInfo.name || !personInfo.age || !personInfo.nationality){
      res.render('show_message', {
         message: "Sorry, you provideed wrong info", type: "error"
      });
   }else {
      var  newPerson = new Person({
         name: personInfo.name,
         age: personInfo.age,
         nationality: personInfo.nationality
      });

      newPerson.save((err, Person) => {
         if(err)
            res.render('show_message',{message: "Database error", type: "error"});
         else
            res.render('show_person', {
               message: "New person added", type: "success", person: personInfo
            }) 
            
      });
   }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));