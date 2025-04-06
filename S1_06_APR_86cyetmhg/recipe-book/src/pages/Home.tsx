import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Recipe } from '../features/recipes/recipesSlice';
import { FiPlus } from 'react-icons/fi';
import './Home.css'; 

const Home = () => {
  const recipes = useSelector((state: RootState) => state.recipe.recipes);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Recipe Book 📖</h1>
        <Link to="/add" className="add-recipe-button">
          <FiPlus className="add-recipe-icon" />
          Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="empty-message">No recipes yet. Start by adding a new recipe!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe: Recipe) => (
            <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
              <div className="recipe-card">
                <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
                <div className="recipe-content">
                  <h2 className="recipe-title">{recipe.title}</h2>
                  <p className="recipe-ingredients">{recipe.ingredients.substring(0, 50)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
