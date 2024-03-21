const mongoose = require('mongoose');

const MotorSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    status: {
        type: Boolean
    },

    image: {
        type: [String]
    }
});

const MotorModel = mongoose.model('motor', MotorSchema);

module.exports = MotorModel;

