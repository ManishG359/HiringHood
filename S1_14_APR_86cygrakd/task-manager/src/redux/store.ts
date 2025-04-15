import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';

import { saveTasksToStorage } from "../utils/storage";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});
store.subscribe(() => {
    const state = store.getState();
    saveTasksToStorage(state.tasks.tasks);
  });
  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
