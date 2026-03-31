import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    await api.post('/auth/logout', { refreshToken });
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
  if (data.data?.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }
  return data;
};

// Dashboard
export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data.data;
};

// CMS
export const getCMSContent = async (page: string) => {
  const { data } = await api.get(`/cms/${page}`);
  return data.data;
};

export const updateCMSContent = async (page: string, content: any) => {
  const { data } = await api.put(`/cms/${page}`, { content });
  return data.data;
};

export const getAllCMS = async () => {
  const { data } = await api.get('/cms');
  return data.data;
};

// Services
export const getServices = async () => {
  const { data } = await api.get('/services');
  return data.data;
};

export const createService = async (formData: FormData) => {
  const { data } = await api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const updateService = async (id: string, formData: FormData) => {
  const { data } = await api.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const deleteService = async (id: string) => {
  await api.delete(`/services/${id}`);
};

// Skills
export const getSkills = async () => {
  const { data } = await api.get('/skills');
  return data.data;
};

export const createSkill = async (formData: FormData) => {
  const { data } = await api.post('/skills', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const updateSkill = async (id: string, formData: FormData) => {
  const { data } = await api.put(`/skills/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const deleteSkill = async (id: string) => {
  await api.delete(`/skills/${id}`);
};

// Portfolio
export const getPortfolios = async () => {
  const { data } = await api.get('/portfolio');
  return data.data;
};

export const createPortfolio = async (formData: FormData) => {
  const { data } = await api.post('/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const updatePortfolio = async (id: string, formData: FormData) => {
  const { data } = await api.put(`/portfolio/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const deletePortfolio = async (id: string) => {
  await api.delete(`/portfolio/${id}`);
};

// Jobs
export const getJobs = async () => {
  const { data } = await api.get('/jobs');
  return data.data;
};

export const createJob = async (payload: any) => {
  const { data } = await api.post('/jobs', payload);
  return data.data;
};

export const updateJob = async (id: string, payload: any) => {
  const { data } = await api.put(`/jobs/${id}`, payload);
  return data.data;
};

export const deleteJob = async (id: string) => {
  await api.delete(`/jobs/${id}`);
};

// Applications
export const getApplications = async (params?: Record<string, string>) => {
  const { data } = await api.get('/applications', { params });
  return data;
};

export const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
  const { data } = await api.patch(`/applications/${id}/status`, { status, notes });
  return data.data;
};

// Leads
export const getLeads = async (params?: Record<string, string>) => {
  const { data } = await api.get('/leads', { params });
  return data;
};

export const updateLeadStatus = async (id: string, status: string, notes?: string) => {
  const { data } = await api.patch(`/leads/${id}/status`, { status, notes });
  return data.data;
};

export const deleteLead = async (id: string) => {
  await api.delete(`/leads/${id}`);
};

// Users/Admins
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data.data;
};

export const createUser = async (payload: { name: string; email: string; password: string; role: string }) => {
  const { data } = await api.post('/users', payload);
  return data.data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data.data;
};

export default api;
