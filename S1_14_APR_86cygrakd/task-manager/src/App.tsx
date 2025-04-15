import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import TaskFormPage from './pages/TaskFormPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/task/:taskId" element={<TaskDetailsPage />} />
      <Route path="/task/:taskId/edit" element={<TaskFormPage />} />
      <Route path="/add" element={<TaskFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
