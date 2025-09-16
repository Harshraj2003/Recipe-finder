import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';
import { AuthContext } from '../context/AuthContext';
import { addFavorite } from '../services/favoriteService';
import LoadingSpinner from '../components/LoadingSpinner';


import { Container, Grid, Box, Typography, Button, Stack, Alert } from '@mui/material';

const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState({ message: '', type: '' });


  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(recipeId);
        setRecipe(data);
      } catch (error) {
        console.error('Failed to fetch recipe details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetails();
  }, [recipeId]);

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(
          <li key={i}>
            <strong>{ingredient}</strong> - {measure}
          </li>
        );
      } else {
        break;
      }
    }
    return ingredients;
  };

  const handleSaveToFavorites = async () => {
    setFeedback({ message: '', type: '' }); // clear old feedback
    try {
      const response = await addFavorite(recipe.idMeal);
      setFeedback({ message: response.message || 'Saved to favorites!', type: 'success' });
    } catch (err) {
      setFeedback({ message: err.message || 'Failed to save favorite.', type: 'error' });
    }
  };

 
  if (loading) return <LoadingSpinner />;
  if (!recipe) return <Typography>Recipe not found.</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            sx={{
              width: '100%',
              borderRadius: 2, // Corresponds to theme.shape.borderRadius * 2
              boxShadow: 3, // Applies a theme-based shadow
            }}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <Typography variant="h3" component="h1">
              {recipe.strMeal}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Category: {recipe.strCategory} | Area: {recipe.strArea}
            </Typography>

            {/* Conditionally render the save button */}
            {user && (
              <Button variant="contained" onClick={handleSaveToFavorites} sx={{ alignSelf: 'flex-start' }}>
                Save to Favorites
              </Button>
            )}

            {feedback.message && (
              <Alert severity={feedback.type}>{feedback.message}</Alert>
            )}

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Ingredients
              </Typography>
              {getIngredients().map((ing, index) => (
                <Typography key={index} variant="body1" component="p">
                  - {ing}
                </Typography>
              ))}
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Instructions
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {recipe.strInstructions}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipePage;
