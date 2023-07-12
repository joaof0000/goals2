// Import our  model in order to talk to the salons collection in mongodb
const SalonModel = require('../models/salon');

module.exports = {
    create,
    delete: deleteReview
};

async function deleteReview(req, res, next) {

    try{
        //Find the appointment with the review
        const salonDoc = await SalonModel.findOne({'reviews._id': req.params.id, 'reviews.user': req.user._id});

        //A user that is not logged in
        if(!salonDoc) return res.redirect('/salons');

        //Remove the review from the salon salon.review array
        //remove takes the id of the review
        salonDoc.reviews.remove(req.params.id);
        //Muted the salonDoc reviews array so we need to tell mongodb to update the database
        await salonDoc.save();
    
        //tells the client to make a request to this route 
        res.redirect(`/salons/${req.params.id}`);

    }catch(err){
        next(err)
    }
}

async function create(req,res) {
    console.log(req.body);

    try {

        const salonFromTheDatabase = await SalonModel.findById(req.params.id);
        //Add the logged in user property to req,body
        req.body.user = req.user._id;
        req.body.userName = req.user.Name;
        req.body.userAvatar = req.user.avatar;

        salonFromTheDatabase.reviews.push(req.body);
        // since I changed a document (salonFromTheDb) (I mutated it)
		// I have to tell mongodb that, so we have to save
        await salonFromTheDatabase.save();
        //Then respond to the client
        console.log(salonFromTheDatabase);
        res.redirect(`/salons/${req.params.id}`);
    }catch(err) {
        res.send(err)
    }
}