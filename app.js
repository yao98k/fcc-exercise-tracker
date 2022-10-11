//All function on this page.
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser")
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const mongoose = require('mongoose');

//App uses
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParserErrorHandler());

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
/////App uses /////////////

//Database creation, conection, models...
 mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  });

  const ExerciseSchema = mongoose.Schema({
    "description": {"type": String, "required": true},
    "duration": {"type": Number, "required": true},
    "date": String
  });

  const UserSchema = mongoose.Schema({
    "username": {"type": String, "required": true},
    "log": [ExerciseSchema]
  });


  const Exercise = mongoose.model("Exercise", ExerciseSchema);

  const User = mongoose.model("User", UserSchema);

  ////// Database creation//////////


//Routes and operations

//Get All Users
// app.get("/api/users",function(req,res){
//   try{
//     User.find({},function(err,foundData){
//       if(err){console.log(err);}
//
//       res.status(200).json(foundData);
//     });
//   }
//   catch(error){
//     console.log("catch  " + error);
//   }
// });

app.get("/api/users", (req, res) => {
  User.find({}, (err, data) => {
    if(!data){
      res.send("No users")
    }else{
      res.json(data);
    }
  });
});


//Create User

app.post("/api/users",function(req,res){
  const username = req.body.username;
  const newUser = new User({username:username});
  newUser.save(function(err){
    if(err){console.log("Error - Create User : " + err );}
    let sendData = {
      "username":newUser.username,
      "_id":newUser._id
    };
    res.status(200).json(sendData);
  });
});

//Create Exercise
app.post("/api/users/:postId/exercises",function(req,res){
  let userId = req.params.postId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  date = new Date(date).toDateString();

  if(date ===""||date == "Invalid Date"){
    let currentDate = new Date();
    date = currentDate.toDateString();
  }

  const newExercise = new Exercise({
    "description" : description,
    "duration" : duration,
    "date" :date
  });

  try{
  User.findByIdAndUpdate(
    {_id:userId}
    ,{$push:{"log":newExercise}}
    ,{new:true}
    ,function(err,foundData){
      console.log(foundData);
     if(err){console.log("Error - Create Exercise : " + err );;}
     if(!foundData){console.log("foundData - Create User : ");}
     res.status(200).json({
       "username":foundData.username,
       "description":newExercise.description,
       "duration":newExercise.duration,
       "date":newExercise.date,
       "_id":foundData._id
     });
  });
  }
  catch(e){
   res.send(e);
  }
});

//Get logs
app.get("/api/users/:postId/logs",function(req,res){
  let userId = req.params.postId;
  let fromQuery = req.query.from;
  let toQuery = req.query.to;
  let limitQuery = req.query.limit;

  User.findById(
    {_id : userId}, (error, foundData) => {
    if (error) {
      console.log(error);
      res.send("Something Went wrong. Get Exercises");
    }
    let logs = foundData.log;
    let filteredLogs = logs.map(log => {

      let des = log.description;
      let dur = log.duration;
      let date = log.date;

      let userLogs = {
        "description": des,
        "duration": dur,
        "date": date
      };
      return userLogs;
    });

    let resObject = {};

    resObject['username'] = foundData.username;
    resObject['count'] = foundData.log.length;
    resObject['_id'] = foundData.id;
    resObject['log'] = filteredLogs;

  function objectLimiter(input) {
      let limit = input.slice(0, limitQuery);
      return limit;
    }

    if (fromQuery || toQuery) {

      let fromDate = new Date(0);
      let toDate = new Date();


      if (fromQuery) {
        fromDate = new Date(fromQuery);
      }
      if (toQuery) {
        toDate = new Date(toQuery);
      }

      fromDate = fromDate.getTime();
      toDate = toDate.getTime();


      let logSearch = foundData.log.filter((exercise) => {
        let exerciseDate = new Date(exercise.date).getTime();
        return exerciseDate >= fromDate && exerciseDate <= toDate;
      });

      resObject['username'] = foundData.username;
      resObject['count'] = logSearch.length;
      resObject['_id'] = foundData.id;
      resObject['log'] = logSearch;
    }

    //filters/slices the log to a given log length or count.
    if (limitQuery) {
      resObject['username'] = foundData.username;
      resObject['count'] = objectLimiter(resObject.log).length;
      resObject['_id'] = foundData.id;
      resObject['log'] = objectLimiter(resObject.log);
    }

    res.status(200).json(resObject);
  });

});






/////Routes and operations /////////




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
