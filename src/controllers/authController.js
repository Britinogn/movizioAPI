// import User from '../models/Users';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';


// exports.register = async( req, res ) =>{

// }

import User from '../models/Users.js'; // Added .js for ESM consistency
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Generate JWT (exclude password from payload)
    const payload = { id: newUser._id };
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Response (send token, not password)
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async  (req, res) =>{
    try {
        const {email , password} = req.body;
        
       // Basic validation
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password'); // Include password for comparison
        if (!user) {
          return res.status(400).json({ message: 'Invalid email. Please check your credentials and try again.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({  message: 'Incorrect password. Please try again.' });
        }

        // Generate JWT (exclude password from payload)
        const payload = { id: user._id };
        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET, 
          { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
        );

        // Response (send token, not password)
        res.status(200).json({
          message: 'Login successful',
          token,
          user: {
              id: user._id,
              email: user.email,
              password: user.password,
          }
        });



    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}


export default {register, login};