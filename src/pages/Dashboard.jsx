import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { LogOut } from "lucide-react"; // Logout আইকন

const Dashboard = () => {
  const {
    axios, projects, setProjects, tasks, setTasks,
    selectedProject, setSelectedProject, searchTerm, setSearchTerm,
    filterStatus, setFilterStatus, filterPriority, setFilterPriority,
    currentPage, setCurrentPage, itemsPerPage, fetchProjects, fetchTasks,
    user, setIsAuthenticated, setUser // ← নতুন
  } = useContext(AppContext);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', status: 'Active' });
  const [taskForm, setTaskForm] = useState({ title: '', assigned_to: '', due_date: '', priority: 'Medium', status: 'Pending' });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = !filterStatus || t.status === filterStatus;
    const matchesPriority = !filterPriority || t.priority === filterPriority;
    return matchesStatus && matchesPriority;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const paginated = selectedProject ? filteredTasks : filteredProjects;
  const totalPages = Math.ceil(paginated.length / itemsPerPage);
  const currentItems = paginated.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Logout ফাংশন - '/' এ রিডাইরেক্ট
  const handleLogout = async () => {
    try {
      await axios.get('/api/user/logout');
      setIsAuthenticated(false);
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/'; // ← এখানে রিডাইরেক্ট
    } catch (error) {
      console.log(error);
      toast.error('Logout failed');
    }
  };

  const handleCreateProject = async () => {
    try {
      const res = await axios.post('/api/projects', projectForm);
      if (res.data.success) {
        setProjects([...projects, res.data.project]);
        setShowProjectModal(false);
        setProjectForm({ name: '', description: '', status: 'Active' });
        toast.success('Project created');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async () => {
    try {
      const res = await axios.put(`/api/projects/${editingProject._id}`, projectForm);
      if (res.data.success) {
        setProjects(projects.map(p => p._id === editingProject._id ? res.data.project : p));
        setShowProjectModal(false);
        setEditingProject(null);
        toast.success('Project updated');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      if (selectedProject?._id === id) setSelectedProject(null);
      toast.success('Project deleted');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete');
    }
  };

  const handleCreateTask = async () => {
    try {
      const res = await axios.post('/api/tasks', { ...taskForm, projectId: selectedProject._id });
      if (res.data.success) {
        setTasks([...tasks, res.data.task]);
        setShowTaskModal(false);
        setTaskForm({ title: '', assigned_to: '', due_date: '', priority: 'Medium', status: 'Pending' });
        toast.success('Task created');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async () => {
    try {
      const res = await axios.put(`/api/tasks/${editingTask._id}`, taskForm);
      if (res.data.success) {
        setTasks(tasks.map(t => t._id === editingTask._id ? res.data.task : t));
        setShowTaskModal(false);
        setEditingTask(null);
        toast.success('Task updated');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Delete task?')) return;
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Project Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Hi, {user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={() => {
                setShowProjectModal(true);
                setEditingProject(null);
                setProjectForm({ name: '', description: '', status: 'Active' });
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              + New Project
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Projects List */}
        {!selectedProject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map(project => (
              <div key={project._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description || 'No description'}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    project.status === 'Active' ? 'bg-green-100 text-green-800' :
                    project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex gap-2 text-sm">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        fetchTasks(project._id);
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setProjectForm({ name: project.name, description: project.description, status: project.status });
                        setShowProjectModal(true);
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tasks View */
          <div>
            <button
              onClick={() => {
                setSelectedProject(null);
                setTasks([]);
                setCurrentPage(1);
              }}
              className="mb-4 text-blue-600 hover:underline"
            >
              Back to Projects
            </button>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name} - Tasks</h2>
              <button
                onClick={() => {
                  setShowTaskModal(true);
                  setEditingTask(null);
                  setTaskForm({ title: '', assigned_to: '', due_date: '', priority: 'Medium', status: 'Pending' });
                }}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                + Add Task
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {currentItems.map(task => (
                <div key={task._id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600">Assigned: {task.assigned_to || 'Unassigned'}</p>
                    <p className="text-xs text-gray-500">
                      Due: {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      task.status === 'Done' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setTaskForm({
                          title: task.title,
                          assigned_to: task.assigned_to,
                          due_date: task.due_date?.split('T')[0] || '',
                          priority: task.priority,
                          status: task.status
                        });
                        setShowTaskModal(true);
                      }}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingProject ? 'Edit' : 'Create'} Project</h3>
            <input
              type="text"
              placeholder="Name"
              value={projectForm.name}
              onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={projectForm.description}
              onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={projectForm.status}
              onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Active</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={editingProject ? handleUpdateProject : handleCreateProject}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                {editingProject ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setShowProjectModal(false)}
                className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">{editingTask ? 'Edit' : 'Create'} Task</h3>
            <input
              type="text"
              placeholder="Title"
              value={taskForm.title}
              onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Assigned to"
              value={taskForm.assigned_to}
              onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={taskForm.due_date}
              onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={taskForm.priority}
              onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              value={taskForm.status}
              onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={editingTask ? handleUpdateTask : handleCreateTask}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                {editingTask ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setShowTaskModal(false)}
                className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;