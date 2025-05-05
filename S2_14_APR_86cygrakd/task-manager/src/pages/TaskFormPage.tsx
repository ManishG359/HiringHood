import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addTask, updateTask, Task } from "../redux/tasksSlice";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from 'notistack';


const TaskFormPage = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { taskId } = useParams();

  const existingTask = useSelector((state: RootState) =>
    state.tasks.tasks.find((task) => task.id === taskId)
  );

  const isEditMode = Boolean(taskId && existingTask);

  const formik = useFormik({
    initialValues: {
      title: existingTask?.title || "",
      description: existingTask?.description || "",
      dueDate: existingTask?.dueDate || "",
      priority: existingTask?.priority || "Medium",
      status: existingTask?.status || "To Do",
      tags: existingTask?.tags?.join(", ") || "",
    },
    enableReinitialize: true, // important to re-fill form when editing
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      dueDate: Yup.date()
        .min(new Date(), "Due date must be in the future")
        .required("Due date is required"),
    }),
    onSubmit: (values) => {
      const taskData: Task = {
        id: existingTask?.id || uuidv4(),
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        priority: values.priority as Task["priority"],
        status: values.status as Task["status"],
        tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
      };

      if (isEditMode) {
        dispatch(updateTask(taskData));
        enqueueSnackbar("Task updated successfully ✅", { variant: "success" });
      } else {
        dispatch(addTask(taskData));
        enqueueSnackbar("Task created successfully 🎉", { variant: "success" });
      }

      navigate("/");
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Task ✏️" : "Add New Task ➕"}
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title *</label>
          <input
            type="text"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            className="w-full border p-2 rounded"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block font-medium">Due Date *</label>
          <input
            type="date"
            name="dueDate"
            onChange={formik.handleChange}
            value={formik.values.dueDate}
            className="w-full border p-2 rounded"
          />
          {formik.touched.dueDate && formik.errors.dueDate && (
            <div className="text-red-500 text-sm">{formik.errors.dueDate}</div>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block font-medium">Priority</label>
          <select
            name="priority"
            onChange={formik.handleChange}
            value={formik.values.priority}
            className="w-full border p-2 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            onChange={formik.handleChange}
            value={formik.values.status}
            className="w-full border p-2 rounded"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            onChange={formik.handleChange}
            value={formik.values.tags}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          {isEditMode ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskFormPage;
