import axiosInstance from './axiosInstance';

export interface SeekerProfile {
  fullName?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  resumeLink?: string;
}

export interface EmployerProfile {
  companyName?: string;
  about?: string;
  website?: string;
  industry?: string;
  location?: string;
}

export const fetchMyProfile = async () => {
  const response = await axiosInstance.get('/profile/me');
  return response.data;
};

export const updateProfile = async (
  profileData: SeekerProfile | EmployerProfile
) => {
  const response = await axiosInstance.put('/profile', profileData);
  return response.data;
};
