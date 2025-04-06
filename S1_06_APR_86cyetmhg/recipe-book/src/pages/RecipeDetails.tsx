
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteRecipe } from '../features/recipes/recipesSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 

  const recipe = useSelector((state: RootState) =>
    state.recipe.recipes.find((recipe) => recipe.id === id)
  );

  if (!recipe) {
    return <p>Recipe not found!</p>;
  }
  const handleDelete = (id:string) => {
    dispatch(deleteRecipe(id));
    navigate('/');
  };
  const handleEdit = () => {
    navigate(`/edit/${recipe.id}`, { state: { recipe } });
  };

  return (
    <div>
        
      <Link to="/" style={{ textDecoration: 'none', color: '#4caf50' }}>
        ← Back to Home
      </Link>

      <div style={{ marginTop: '20px' }}>
        <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
        <h1 style={{ marginTop: '16px' }}>{recipe.title}</h1>
        <h3>Ingredients</h3>
        <p>{recipe.ingredients}</p>

        <h3>Instructions</h3>
        <p>{recipe.instructions}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Link to={`/edit/${recipe.id}`} state={{ recipe }}>
            <button onClick={handleEdit} style={{ padding: '8px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px' }}>
              Edit Recipe
            </button>
          </Link>
          <button onClick={()=> handleDelete(recipe.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Delete Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
