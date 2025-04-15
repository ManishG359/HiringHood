import { Task } from "../redux/tasksSlice";
import { useDebouncedValue } from "../hooks/useDebouncedValues";
import { useMemo } from "react";

interface UseFilteredTasksProps {
  tasks: Task[];
  statusFilter: string;
  priorityFilter: string;
  searchQuery: string;
}

export const useFilteredTasks = ({
  tasks,
  statusFilter,
  priorityFilter,
  searchQuery,
}: UseFilteredTasksProps) => {
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;

      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(lowerCaseQuery) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery));

      return matchesStatus && matchesPriority && (!debouncedSearchQuery || matchesSearch);
    });
  }, [tasks, statusFilter, priorityFilter, debouncedSearchQuery]);

  return filteredTasks;
};
