import axiosInstance from './axiosInstance';

export const fetchJobs = async (_page: number) => {
  const response = await axiosInstance.get('/jobs');
  return Array.isArray(response.data.jobs) ? response.data.jobs : [];
};

export const fetchJobById = async (id: string) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  };

export const postJob = async (jobData: any) => {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data;
  };
export const fetchMyJobs = async () => {
    const response = await axiosInstance.get('/jobs/my');
    return response.data;
  };
  
export const deleteJob = async (jobId: string) => {
    const response = await axiosInstance.delete(`/jobs/${jobId}`);
    return response.data;
  };
  

export const fetchJobByIds = async (jobId: string) => {
    const response = await axiosInstance.get(`/jobs/${jobId}`);
    return response.data;
  };
  
export const updateJob = async (jobId: string, jobData: any) => {
    const response = await axiosInstance.put(`/jobs/${jobId}`, jobData);
    return response.data;
  };
export const fetchRecentJobs = async () => {
    const response = await axiosInstance.get('/jobs?limit=6'); // optionally ?sort=newest
    return response.data.jobs;
  };
  
export const optimizeJobDescription = async (jobDescription: string, companyId: string) => {
  try {
    const response = await axiosInstance.post('/jobs/optimize', {
      jobDescription,
      companyId
    });
    return response.data;
  } catch (error) {
    console.error('Error optimizing job description:', error);
    throw error;
  }
};
