import { Task } from "../redux/tasksSlice";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div className="task-card" onClick={() => navigate(`/task/${task.id}`)}>
      <h3>{task.title}</h3>
      <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.status}</p>
      {task.tags && task.tags.length > 0 && (
        <p><strong>Tags:</strong> {task.tags.join(", ")}</p>
      )}
    </div>
  );
};

export default TaskCard;
