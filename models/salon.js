const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//One salon has many reviews
//A review belogs to a salon
//is the relationship for the the reviews and movies

//write the many (side) review Schema in the one side (in this case salon)

const reviewSchema = new Schema({
    Content: {
        type: String,
        required: true
    },
    Rating: {
        type: Number,
        min:1,
        max: 5,
        default: 5
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    userName: String,
    userAvatar: String
}, {
    timestamps: true
})






//one Appointment
// SCHEMA Defines what structure/shape 
// that the documents created from the Salon Model
// that our stored in the database should look like

const salonSchema = new mongoose.Schema({
    Name: {
        type:String,
        required: true
    },
    Date: {
        type: Date,
        default: () => new Date(new Date().setFullYear(new Date().getFullYear()+1)),
    },
    AppointmentType: {
        type: String,
        enum: ['Haircut', 'Hair-Color','Hair-Extentions', 'Hair-Straightening', 'Hair-Permimg','Styling'],
        required: true
    },
    CorrectInformation: {
        type: Boolean, 
        default: true
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Salon', salonSchema);