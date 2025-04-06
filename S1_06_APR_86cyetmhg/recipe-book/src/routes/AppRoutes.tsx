import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AddRecipe from '../pages/AddRecipe';
import RecipeDetails from '../pages/RecipeDetails';
import EditRecipe from '../pages/EditRecipe';
import Layout from '../components/Layout';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="add" element={<AddRecipe />} />
      <Route path="recipe/:id" element={<RecipeDetails />} />
      <Route path="edit/:id" element={<EditRecipe />} />
    </Route>
  </Routes>
);

export default AppRoutes;
