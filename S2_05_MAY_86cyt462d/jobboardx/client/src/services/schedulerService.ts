import axios from './axiosInstance';
const API_BASE = '/scheduler';

export const splitInterviewSlots = (payload: {
  slots: number[];
  numTeams: number;
  bufferTime?: number;
}) => {
  return axios.post(`${API_BASE}/split`, payload);
};

export const calculateTimeline = (payload: {
  candidates: number;
  dailyCapacity: number;
  parallelTracks: number;
  startDate?: string;
  excludeWeekends?: boolean;
  holidays?: string[];
}) => {
  return axios.post(`${API_BASE}/timeline`, payload);
};
