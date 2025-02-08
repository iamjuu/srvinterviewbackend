const mongoose = require('mongoose');

const SignupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    subscribe: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product', 
          required: true
        },
        status: {
          type: Boolean,
          default: false
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
});
const Signup = mongoose.model('signup', SignupSchema);
module.exports = Signup;
