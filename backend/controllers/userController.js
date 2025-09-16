// controllers/userController.js

// Import the User model we created. We need this to interact with the 'users' collection in our database.
const User = require('../models/User');
// Import jsonwebtoken for creating a token upon successful registration.
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// A helper function to generate a JWT.
// It takes the user's ID as a payload.
const generateToken = (id) => {
  // jwt.sign() creates a token.
  // The first argument is the payload (data to store in the token).
  // The second argument is the JWT_SECRET from our .env file. This secret is used to sign and verify tokens.
  // The third argument is an options object. 'expiresIn' sets the token's expiration time.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days.
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // 1. Destructure the name, email, and password from the request body.
    const { name, email, password } = req.body;

    // 2. Basic Validation: Check if all required fields were provided.
    if (!name || !email || !password) {
      res.status(400); // 400 Bad Request
      throw new Error('Please add all fields');
    }

    // 3. Check if the user already exists in the database.
    // We use the User model's findOne method to search for a user by their email.
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400); // 400 Bad Request
      throw new Error('User already exists');
    }

    // 4. If the user doesn't exist, create a new user.
    // The User.create() method creates a new document and saves it to the database.
    // Our pre-save hook in the User model will automatically hash the password.
    const user = await User.create({
      name,
      email,
      password,
    });

    // 5. If the user was created successfully, send a response.
    if (user) {
      // We send a 201 Created status code.
      // The response includes the user's data (excluding the password) and a JWT.
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // Generate a token for the new user
      });
    } else {
      res.status(400); // 400 Bad Request
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    // 1. Destructure the email and password from the request body.
    const { email, password } = req.body;

    // 2. Find the user in the database by their email address.
    const user = await User.findOne({ email });

    // 3. Check if a user was found AND if the provided password is correct.
    // 'bcrypt.compare' is an asynchronous function that takes the plain-text password
    // from the request and the hashed password from the database and returns a boolean.
    // It securely handles the comparison without ever exposing the hash.
    if (user && (await bcrypt.compare(password, user.password))) {
      // 4. If credentials are valid, send a success response (200 OK) with the
      // user's data and a newly generated JWT for their session.
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // 5. If no user is found or the password doesn't match, the credentials are invalid.
      // We set a 401 Unauthorized status code and throw an error.
      // The generic error message is a security best practice.
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    // This will catch the 'Invalid credentials' error or any other database/server errors.
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};


module.exports = { registerUser, loginUser };