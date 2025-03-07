const mongoose = require('mongoose');


// TODO modify this after user is created
const InfoSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

  const Info = mongoose.model('Info', InfoSchema);

  module.exports = Info;