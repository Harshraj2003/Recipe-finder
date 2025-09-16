import React, { useState, useEffect } from 'react';
import { getFavorites, removeFavorite, updateFavoriteNote } from '../services/favoriteService';
import { getRecipeById } from '../services/recipeService'; 
import RecipeCard from '../components/RecipeCard'; 
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorComponent from '../components/ErrorComponent';
import { Container, Grid, Typography, Button, Box, Paper } from '@mui/material';
import NotesEditModal from '../components/NotesEditModal'; 

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchAndProcessFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const favoriteObjects = await getFavorites();
        if (favoriteObjects.length === 0) {
          setFavoriteRecipes([]);
          setLoading(false);
          return;
        }

        const recipeIds = favoriteObjects.map(fav => fav.recipeId);
        const recipeDetailPromises = recipeIds.map(id => getRecipeById(id));
        const fetchedRecipeDetails = await Promise.all(recipeDetailPromises);
        
        const combinedFavorites = fetchedRecipeDetails.map(recipe => {
          const userFavoriteData = favoriteObjects.find(
            fav => fav.recipeId === recipe.idMeal
          );
          return {
            ...recipe,
            notes: userFavoriteData ? userFavoriteData.notes : '',
          };
        });
        
        setFavoriteRecipes(combinedFavorites);

      } catch (err) {
        setError(err.message || 'An error occurred while fetching your favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessFavorites();
  }, []);

  // 🔹 Remove Favorite Handler
  const handleRemoveFavorite = async (recipeId) => {
    try {
      await removeFavorite(recipeId);
      setFavoriteRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.idMeal !== recipeId)
      );
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert(err.message || 'Could not remove favorite. Please try again.');
    }
  };

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSaveNotes = async (recipeId, newNotes) => {
    try {
      await updateFavoriteNote(recipeId, newNotes);
      setFavoriteRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.idMeal === recipeId ? { ...recipe, notes: newNotes } : recipe
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save notes:', err);
      alert(err.message || 'Could not save notes. Please try again.');
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <ErrorComponent message={error} />
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          My Favorite Recipes
        </Typography>
        
        {favoriteRecipes.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            You haven't saved any favorite recipes yet. Start exploring!
          </Typography>
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {favoriteRecipes.map(recipe => (
              <Grid item key={recipe.idMeal} xs={12} sm={6} md={4} lg={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <RecipeCard recipe={recipe} />
                  </Box>
                  
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2,
                      mt: -1,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      bgcolor: 'background.default'
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        My Notes:
                      </Typography>

                      
                      <Box>
                        <Button 
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenModal(recipe)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          onClick={() => handleRemoveFavorite(recipe.idMeal)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                    
                    {recipe.notes ? (
                      <Typography variant="body2" sx={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                        {recipe.notes}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No notes yet. Add one!
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      
      {selectedRecipe && (
        <NotesEditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          onSave={handleSaveNotes}
        />
      )}
    </>
  );
};

export default FavoritesPage;
