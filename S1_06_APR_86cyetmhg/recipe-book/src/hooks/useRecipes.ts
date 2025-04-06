import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addRecipe } from '../features/recipes/recipesSlice';

export const useRecipes = () => {
  const recipes = useSelector((state: RootState) => state.recipe.recipes);
  const dispatch = useDispatch();

  const createRecipe = (recipe: any) => dispatch(addRecipe(recipe));

  return { recipes, createRecipe };
};
