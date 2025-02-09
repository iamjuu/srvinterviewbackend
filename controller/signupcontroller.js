const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Signup = require('../model/signup'); // Ensure correct path
const SECRET_KEY = process.env.secretkey; // Replace with a secure key

const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

       
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: 'Email already registered'
            });
        }

     
        const existingPhone = await Signup.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                status: false,
                message: 'Phone number already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new Signup({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({
            status: true,
            message: 'User registered successfully',
            token
        });
console.log('data saved');

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { signup };
