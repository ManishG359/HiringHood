

import { Link } from 'react-router-dom';
import { Recipe } from '../features/recipes/recipesSlice';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' }}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        />
        <div style={{ padding: '16px' }}>
          <h2 style={{ marginBottom: '8px', fontSize: '18px' }}>{recipe.title}</h2>
          <p style={{ fontSize: '14px', color: '#555' }}>
            {recipe.ingredients.length > 50 ? `${recipe.ingredients.substring(0, 50)}...` : recipe.ingredients}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
