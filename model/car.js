const mongoose = require('mongoose');
const { collection } = require('./user');
const Schema = mongoose.Schema;

let carSchema = new Schema({

    name: {

        type: String
    },
    brand: {
        type: String

    }
},
    {

        collection: 'cars'
    }

)

module.exports = mongoose.model('cars', carSchema);

