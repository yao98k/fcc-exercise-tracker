const mongoose = require("mongoose");

const ExerciseSchema = mongoose.Schema({
  "description": {"type": String, "required": true},
  "duration": {"type": Number, "required": true},
  "date": String
});

const UserSchema = mongoose.Schema({
  "username": {"type": String, "required": true},
  "log": [ExerciseSchema]
});

//MODEL.
const Exercise = mongoose.model("Exercise", ExerciseSchema);

const User = mongoose.model("User", UserSchema);

module.exports =  {Exercise,User};
