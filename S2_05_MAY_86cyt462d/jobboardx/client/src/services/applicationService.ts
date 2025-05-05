import axiosInstance from './axiosInstance';

export const applyToJob = async (applicationData: { jobId: string; resumeLink: string; coverLetter?: string }) => {
  const response = await axiosInstance.post('/applications', applicationData);
  return response.data;
};
export const fetchMyApplications = async () => {
    const response = await axiosInstance.get('/applications/me');
    return response.data;
  };
export const withdrawApplication = async (applicationId: string) => {
  const response = await axiosInstance.delete(`/applications/${applicationId}`);
  return response.data;
 };

 export const fetchApplicantsByJobId = async (jobId: string) => {
  const response = await axiosInstance.get(`/applications/job/${jobId}`);
  return response.data;
};
export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const response = await axiosInstance.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};
export const fetchAllApplicantsForEmployer = async () => {
  const response = await axiosInstance.get('/applications/employer');
  return response.data;
};
