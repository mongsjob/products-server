const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ Import bcryptjs

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

// ✅ Hash password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Compare password when user tries to login
userSchema.methods.comparePassword = function(givenPassword){
    return bcrypt.compare(givenPassword, this.password);
}

const User = model('User', userSchema);
module.exports = User;
