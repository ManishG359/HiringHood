import axiosInstance from './axiosInstance';

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string, role: string) => {
  const response = await axiosInstance.post('/auth/register', { name, email, password, role });
  return response.data;
};
