const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// compare password when user tries to login
userSchema.methods.comparePassword = function(givenPassword){
    return (givenPassword, this.password);
}



const User = model('User', userSchema);
module.exports = User;
