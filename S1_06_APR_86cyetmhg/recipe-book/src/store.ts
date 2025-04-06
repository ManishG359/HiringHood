import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './features/recipes/recipesSlice';
import { loadState, saveState } from './utils/localStorage';


const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    recipe: recipesReducer,
  },
  preloadedState,
});

// Subscribe to store changes to persist to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;