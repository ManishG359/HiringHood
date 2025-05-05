import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Stack, CircularProgress, TextField, MenuItem } from '@mui/material';
import { fetchJobs } from '../../services/jobService';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../../src/components/BackToSeekerDashboard';

interface Job {
  role: any;
  _id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  experienceLevel?: string;
}

function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const getJobs = async () => {
      try {
        const data = await fetchJobs(1);
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('❌ Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, locationFilter, typeFilter, jobs]);

  const filterJobs = () => {
    let updatedJobs = [...jobs];
  
    if (searchQuery) {
      updatedJobs = updatedJobs.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (locationFilter) {
      updatedJobs = updatedJobs.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
  
    if (typeFilter) {
      updatedJobs = updatedJobs.filter((job) =>
        job.role?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
  
    setFilteredJobs(updatedJobs);
  };
  

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }
  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setTypeFilter('');
  };
  
  return (
    
    <Container maxWidth="md" sx={{ mt: 6 }}>
       <BackToDashboardButton />
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Browse Jobs 🔍
      </Typography>

      {/* Filters Section */}
      <Stack direction="row" spacing={2} mb={4} flexWrap="wrap" justifyContent="center">
        <TextField
          label="Search by Title"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <TextField
          label="Filter by Location"
          size="small"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <TextField
          label="Filter by Role"
          size="small"
          select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
           <Button
            variant="outlined"
            size="small"
            onClick={handleResetFilters}
         >
            Reset Filters
          </Button>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Full-time">Full-time</MenuItem>
          <MenuItem value="Part-time">Part-time</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
        </TextField>
      </Stack>

      {/* Jobs Section */}
      <Stack spacing={3}>
        {filteredJobs.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No jobs found matching your search/filter.
          </Typography>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job._id} elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {job.companyName} • {job.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.type} {job.experienceLevel ? `• ${job.experienceLevel}` : ''}
                </Typography>

                <Box mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
}

export default BrowseJobs;
