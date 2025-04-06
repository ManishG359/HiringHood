
export const saveState = (state: any) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('recipeAppState', serializedState);
    } catch (err) {
      console.error('Error saving state', err);
    }
  };
  
  export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('recipeAppState');
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('Error loading state', err);
      return undefined;
    }
  };
  