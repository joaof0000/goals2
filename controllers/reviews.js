// Import our  model in order to talk to the goals collection in mongodb
const GoalModel = require("../models/goal");

module.exports = {
  create,
  delete: deleteReview,
  update: updateReview,
};

async function updateReview(req, res) {
  try {
    //Find the appointment with review
    const goalDoc = await GoalModel.findOne({
      "reviews._id": req.params.id,
      "reviews.user": req.user._id,
    });

    //Find the review subdoc using the id method on mongoose arrays
    const reviewSubdoc = goalDoc.reviews.id(req.params.id);
    console.log("reviewSubdoc......: ", reviewSubdoc);
    console.log("req.body.Content......: ", req.body.Content);

    //update the text of the review
    reviewSubdoc.Content = req.body.Content;

    //save the updated book
    goalDoc.save();

    //redirect back to the goal's show page
    res.redirect(`/goals/${goalDoc._id}`);
    // res.redirect(`/goals/`);
  } catch (err) {
    res.send(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    //Find the appointment with the review
    const goalDoc = await GoalModel.findOne({
      "reviews._id": req.params.id,
      "reviews.user": req.user._id,
    });

    //A user that is not logged in
    if (!goalDoc) return res.redirect("/goals");

    //Remove the review from the goal goal.review array
    //remove takes the id of the review
    goalDoc.reviews.remove(req.params.id);
    //Muted the goalDoc reviews array so we need to tell mongodb to update the database
    await goalDoc.save();

    //tells the client to make a request to this route
    res.redirect(`/goals/${goalDoc._id}`);
  } catch (err) {
    res.send(err);
  }
}

async function create(req, res) {
  // console.log(req.body);

  try {
    const goalFromTheDatabase = await GoalModel.findById(req.params.id);
    //Add the logged in user property to req,body
    req.body.user = req.user._id;
    req.body.userName = req.user.Name;
    req.body.userAvatar = req.user.avatar;

    goalFromTheDatabase.reviews.push(req.body);
    // since I changed a document (goalFromTheDb) (I mutated it)
    // I have to tell mongodb that, so we have to save
    await goalFromTheDatabase.save();
    //Then respond to the client
    // console.log(goalFromTheDatabase);
    res.redirect(`/goals/${req.params.id}`);
  } catch (err) {
    res.send(err);
  }
}
