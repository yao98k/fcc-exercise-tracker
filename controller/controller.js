const User = require("../models/users");
const Exercise = require("../models/exercises");


const getAllUsers =  function(req,res){
     User.find({}, (err, foundData) => {
        if(!data){
          res.send("No users");
        }else{
          res.status(200).json(foundData);
        }
      });
};

const createUsers =  function(req,res){
    console.log(req.body.username);
    const newUser = new User({
        username: req.body.username
      });
      newUser.save((err, foundData) => {
        if(err){
          res.send("Error : " + err);
        }else{
          res.status(200).json(foundData);
        }
      });
};

const createExercise = function(req,res){
  console.log("Create Exercise");
  const postId = req.params.postId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  if(!date){
    date = new Date();
  }
  User.findById(postId, (err, userData) => {
    if(err || !userData) {
      res.send("Could not find user");
    }else{
      const newExercise = new Exercise({
        userId: postId,
        description,
        duration,
        date: new Date(date),
      });
      newExercise.save((err, data) => {
        if(err) {
          res.send("There was an error saving this exercise" + err);
        if(!data){res.send("Data not found.");}
        }else {
          const { description, duration, date, _id} = data;
          res.status(200).json({
            username: userData.username,
            description,
            duration,
            date: date.toDateString(),
            _id: userData.userId
          });
        }
      });
    }
  });
};

const getLogs = function(req,res){
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  const postId = req.params.postId;
  User.findById(postId,function(err,userData){
    if(err){res.send("Find by id error : " + err);}
    if(!userData){res.send("Not found user data.");}
    else{
      let dateObj = {};
      if(from){dateObj["$gte"]=new Date(from);}
      if(to){dateObj["$lte"] = new Date(to);}
      let filter = {
        userId:postId
      };
      if(from||to){filter.date=dateObj;}
      let nonNullLimit = limit ?? 50;
      Exercise.find(filter).limit(+nonNullLimit).exec(function(err,exerciseData){
        if(err){res.send("Exercise error : " +err);}
        if(!exerciseData){res.send("Exercise data not found");}
        else{
          let count = exerciseData.length;
          let rawLog = exerciseData;
          const {username, _id} = userData;
          const log = rawLog.map((item) =>({
            description:item.description,
            duration:item.duration,
            date:item.date.toDateString()
          }));
          res.status(200).json({username,count,_id,log});
        }

    });
  }
  });
};



module.exports={getAllUsers,createUsers,createExercise,getLogs};
