const express = require("express");
const router = express.Router();
//creating this controller module
const goalsCtrl = require("../controllers/goals");

//Get /goals
router.get("/", goalsCtrl.home);

//GET /appointments/new
router.get("/new", goalsCtrl.new);

// Get Allapoinment page
router.get("/appointments", goalsCtrl.appointments);

// GET /goals/:id (show functionality) MUST be below new route
router.get("/:id", goalsCtrl.show);

//POST /goals
router.post("/", goalsCtrl.create);

module.exports = router;
