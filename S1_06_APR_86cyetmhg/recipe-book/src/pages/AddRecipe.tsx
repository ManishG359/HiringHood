
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { addRecipe } from '../features/recipes/recipesSlice.ts';
import RecipeForm from '../components/recipeform.tsx';

const AddRecipe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddRecipe = (values: any) => {
    dispatch(addRecipe({ id: uuidv4(), ...values }));
    navigate('/');
  };

  return (
    <RecipeForm
      initialValues={{ title: '', ingredients: '', instructions: '', imageUrl: '' }}
      onSubmit={handleAddRecipe}
      mode="add"
    />
  );
};

export default AddRecipe;
