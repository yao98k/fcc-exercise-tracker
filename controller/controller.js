const {Exercise, User} = require("../models/models");
const asyncWrapper = require("../middleware/async-error");
const {createCustomError} = require("../middleware/custom-error");



const getIndexPage = function(req,res){
  res.sendFile("index.html",{root:"./views"});
};


const getAllUsers =  asyncWrapper( async function(req,res){
  const getUser =  await User.find({});
  if(!getUser){return next(createCustomError("get User Error",404));}
  res.status(200).json({getUser});
});

const createUsers = asyncWrapper( async function(req,res,next){
  const username = req.body.username;
  const newUser = await new User({username:username});
  if(!newUser){return next(createCustomError("new user error"),404);}
  newUser.save();
  res.status(200).json({newUser});


});

const createExercise = function(req,res){
  let userId = req.params.postId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  date = new Date(date).toDateString();

  if(date ===""||date == "Invalid Date"){
    let currentDate = new Date();
    date = currentDate.toDateString();
  }
  else{
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
     if(err){return createCustomError("new exercise error" + err,404);}
     if(!foundData){return  createCustomError("New exercise not found data",404);}
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
};

const getLogs = function(req,res){
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
};



module.exports={getAllUsers,createUsers,createExercise,getLogs,getIndexPage};
