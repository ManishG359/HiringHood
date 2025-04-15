import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TaskCard from "../components/TaskCard";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import { useState } from "react";
import { useFilteredTasks } from "../hooks/useFilteredTasks";



const HomePage = () => {
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTasks = useFilteredTasks({
    tasks,
    statusFilter,
    priorityFilter,
    searchQuery,
  });
  
  return (
    <div className="container">
    <div className="flex justify-between items-center">
      <h1>Task Manager 📝</h1>
      <button onClick={() => navigate("/add")}>➕ Add Task</button>
    </div>
  
    <FilterBar
      statusFilter={statusFilter}
      priorityFilter={priorityFilter}
      searchQuery={searchQuery}
      onStatusChange={setStatusFilter}
      onPriorityChange={setPriorityFilter}
      onSearchChange={setSearchQuery}
      onClearFilters={() => {
        setStatusFilter("");
        setPriorityFilter("");
        setSearchQuery("");
      }}
    />
  
    {filteredTasks.length === 0 ? (
      <p>No tasks match the selected filters.</p>
    ) : (
      <div className="task-grid">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    )}
  </div>
  
  );
};

export default HomePage;
