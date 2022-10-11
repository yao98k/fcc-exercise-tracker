const mongoose = require("mongoose");
const ExerciseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    description: String,
    duration: Number,
    date: Date,
  });

  module.exports = mongoose.model("Exercise",ExerciseSchema);