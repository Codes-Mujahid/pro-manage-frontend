import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/user/is-auth');
        if (res.data.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          fetchProjects();
        }
      } catch (error) {
        console.log(error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      if (res.data.success) setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load projects');
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await axios.get(`/api/tasks/${projectId}`);
      if (res.data.success) setTasks(res.data.tasks);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load tasks');
    }
  };

  const value = {
    axios, formData, setFormData, loginData, setLoginData, user, setUser,
    isAuthenticated, setIsAuthenticated, projects, setProjects, tasks, setTasks,
    selectedProject, setSelectedProject, searchTerm, setSearchTerm,
    filterStatus, setFilterStatus, filterPriority, setFilterPriority,
    currentPage, setCurrentPage, itemsPerPage, fetchProjects, fetchTasks
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};