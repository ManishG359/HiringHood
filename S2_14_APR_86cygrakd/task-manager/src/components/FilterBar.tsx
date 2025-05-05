interface FilterBarProps {
    statusFilter: string;
    priorityFilter: string;
    searchQuery: string;
    onStatusChange: (status: string) => void;
    onPriorityChange: (priority: string) => void;
    onSearchChange: (search: string) => void;
    onClearFilters: () => void;
  }
  
  const FilterBar: React.FC<FilterBarProps> = ({
    statusFilter,
    priorityFilter,
    searchQuery,
    onStatusChange,
    onPriorityChange,
    onSearchChange,
    onClearFilters,
  }) => {
    return (
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-xl shadow-md animate-fadeIn">
        {/* Search */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1 text-gray-700">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or tags"
            className="border p-2 rounded w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="border p-2 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
  
        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="border p-2 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
  
        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="bg-gray-300 px-4 py-2 rounded-xl shadow hover:bg-gray-400 transition-all duration-300"
        >
          Clear Filters ✖️
        </button>
      </div>
    );
  };
  
  export default FilterBar;
  