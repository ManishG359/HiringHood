import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTask } from "../redux/tasksSlice";
import { useState } from "react";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((task) => task.id === taskId)
  );

  if (!task) {
    return (
      <div className="container">
        <h1>Task not found ❌</h1>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    navigate("/");
  };

  return (
    <div className="container">
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        animation: 'fadeIn 0.5s ease-in-out'
      }}>
        <h1>{task.title}</h1>
        <p><strong>Description:</strong> {task.description || "No description provided."}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Status:</strong> {task.status}</p>
        {task.tags && task.tags.length > 0 && (
          <p><strong>Tags:</strong> {task.tags.join(", ")}</p>
        )}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate(`/task/${task.id}/edit`)}>✏️ Edit</button>
          <button
            style={{ backgroundColor: '#dc3545' }}
            onClick={() => setShowConfirm(true)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this task?</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                style={{ backgroundColor: '#dc3545' }}
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPage;
