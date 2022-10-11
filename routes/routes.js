const { application } = require("express");
const express = require("express");
const router = express.Router();

const {getAllUsers,createUsers,createExercise,getLogs} = require( "../controller/controller")


//Yollar buraya gelecek

router.route("/").get(getAllUsers);
router.route("/").post(createUsers);
router.route("/:postId/exercises").post(createExercise);
router.route("/:postId/logs").get(getLogs);

module.exports = router;
