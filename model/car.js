const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;


let carSchema = new Schema({

    name: {
        type: String
    },
    brand: {
        type: String

    },
    message: {
        type: String

    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }

},
    { timestamps: true },
    {

        collection: 'cars'
    }


)

module.exports = mongoose.model('cars', carSchema);

