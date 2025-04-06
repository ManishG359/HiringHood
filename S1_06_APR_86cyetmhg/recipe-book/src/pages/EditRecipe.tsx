import RecipeForm from '../components/recipeform';
import { useDispatch } from 'react-redux';
import {updateRecipe} from '../features/recipes/recipesSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recipe = useSelector((state: RootState) =>
    state.recipe.recipes.find(r => r.id === id)
  );

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const initialValues = {
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    imageUrl: recipe.imageUrl,
  };

  const handleSubmit = (values: typeof initialValues) => {
    dispatch(updateRecipe({ ...values, id: recipe.id }));
    navigate('/');
  };

  return <RecipeForm initialValues={initialValues} onSubmit={handleSubmit} mode="edit" />;
};

export default EditRecipe;
