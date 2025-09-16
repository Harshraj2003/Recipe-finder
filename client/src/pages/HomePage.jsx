
import React, { useState } from 'react';
import { searchRecipes } from '../services/recipeService';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

import { Container, Grid, Typography, Box } from '@mui/material';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    const results = await searchRecipes(query);
    setRecipes(results || []);
    setSearched(true);
    setLoading(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Recipe Finder
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Discover your next favorite meal. Search for any recipe you can imagine!
      </Typography>
      
      <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {recipes.map((recipe) => (
            <Grid item key={recipe.idMeal} xs={12} sm={6} md={4} lg={3}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}

      {searched && !loading && recipes.length === 0 && (
        <Typography align="center" sx={{ mt: 4 }}>
          No recipes found for "{query}". Please try another search.
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;