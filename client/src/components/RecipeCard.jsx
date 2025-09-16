
import { Link } from 'react-router-dom';

import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';

const RecipeCard = ({ recipe }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        to={`/recipe/${recipe.idMeal}`}
        sx={{ flexGrow: 1 }} 
      >

        <CardMedia
          component="img"
          height="200"
          image={recipe.strMealThumb}
          alt={recipe.strMeal}
        />

        <CardContent>

          <Typography gutterBottom variant="h6" component="div">
            {recipe.strMeal}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;
