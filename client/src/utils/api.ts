import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchCMS = async (page: string) => {
  const { data } = await api.get(`/cms/${page}`);
  return data.data;
};

export const fetchServices = async () => {
  const { data } = await api.get('/services?active=true');
  return data.data;
};

export const fetchServiceBySlug = async (slug: string) => {
  const { data } = await api.get(`/services/${slug}`);
  return data.data;
};

export const fetchPortfolios = async (params?: Record<string, string>) => {
  const { data } = await api.get('/portfolio', { params: { active: 'true', ...params } });
  return data.data;
};

export const fetchPortfolioBySlug = async (slug: string) => {
  const { data } = await api.get(`/portfolio/${slug}`);
  return data.data;
};

export const fetchJobs = async () => {
  const { data } = await api.get('/jobs?active=true');
  return data.data;
};

export const fetchJobById = async (id: string) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data.data;
};

export const submitApplication = async (jobId: string, formData: FormData) => {
  const { data } = await api.post(`/applications/${jobId}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const submitContact = async (payload: Record<string, string>) => {
  const { data } = await api.post('/leads', payload);
  return data;
};

export default api;
