// server/routes/favoriteRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// @desc    Get all favorites
// @route   GET /api/favorites
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+favorites');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.favorites);
}));

// @desc    Add a recipe to favorites
// @route   POST /api/favorites
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { recipeId } = req.body;

  if (!recipeId) {
    res.status(400);
    throw new Error('Recipe ID is required');
  }

  const user = await User.findById(req.user.id).select('+favorites');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if already in favorites (array of objects)
  const isAlreadyFavorite = user.favorites.some(
    (favorite) => favorite.recipeId === recipeId
  );

  if (isAlreadyFavorite) {
    res.status(400);
    throw new Error('Recipe is already in favorites');
  }

  // Push object (recipeId + notes default from schema)
  user.favorites.push({ recipeId });

  await user.save();

  res.status(201).json({
    message: 'Recipe added to favorites successfully',
    favorites: user.favorites,
  });
}));

router.put('/:recipeId', protect, async (req, res) => {
  try {
    // 1. Get the recipeId from the URL parameters (e.g., /api/favorites/52772)
    const { recipeId } = req.params;
    // 2. Get the new notes content from the request body.
    const { notes } = req.body;

    // A small validation check to ensure notes are provided.
    if (notes === undefined) {
      return res.status(400).json({ message: 'Notes field is required' });
    }

    // 3. Find the user and update the specific favorite in one atomic operation.
    //    `findOneAndUpdate` is the perfect tool for this.
    const updatedUser = await User.findOneAndUpdate(
      // The QUERY part: First, find the user by their ID. Then, within that user's
      // `favorites` array, find the element that has a matching `recipeId`.
      // The dot notation 'favorites.recipeId' is how we query inside an array of objects.
      { _id: req.user.id, 'favorites.recipeId': recipeId },
      
      // The UPDATE part: We use the `$set` operator to update a field.
      // The `favorites.$.notes` syntax is the key. The `$` is the positional
      // operator. It acts as a placeholder for the index of the array element
      // that was matched by the query part. So, it means "update the `notes` field
      // of the specific favorite we found".
      { $set: { 'favorites.$.notes': notes } },
      
      // The OPTIONS part: `{ new: true }` tells Mongoose to return the
      // document *after* the update has been applied. Without this, it would
      // return the document as it was *before* the update.
      { new: true }
    );

    // 4. Check if the update was successful. If `updatedUser` is null, it means
    //    the query didn't find a matching document (either the user doesn't exist,
    //    or they don't have that specific recipe in their favorites).
    if (!updatedUser) {
      return res.status(404).json({ message: 'Favorite recipe not found for this user.' });
    }

    // 5. Send a success response. We can send a message and the updated list of favorites.
    res.status(200).json({
      message: 'Notes updated successfully',
      favorites: updatedUser.favorites,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.delete('/:recipeId', protect, asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { favorites: { recipeId } } }, // remove object with matching recipeId
    { new: true, select: '+favorites' }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    message: 'Recipe removed from favorites successfully',
    favorites: updatedUser.favorites,
  });
}));

module.exports = router;
