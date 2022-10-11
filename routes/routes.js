const { application } = require("express");
const express = require("express");
const router = express.Router();

const {getAllUsers,createUsers,createExercise,getLogs,getIndexPage} = require( "../controller/controller")


//Yollar buraya gelecek
router.route("/").get(getIndexPage);
router.route("/api/users").get(getAllUsers);
router.route("/api/users").post(createUsers);
router.route("/api/users/:postId/exercises").post(createExercise);
router.route("/api/users/:postId/logs").get(getLogs);

module.exports = router;
