import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Stack, IconButton, Snackbar, Alert as MuiAlert, CircularProgress } from '@mui/material';
import { CheckCircle, Edit, Save, Delete } from '@mui/icons-material';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledSnackbar = styled(Snackbar)`
  .MuiPaper-root {
    border-radius: 8px;
  }
`;

const StyledAlert = styled(MuiAlert)<{ severity: 'success' | 'error' | 'info' }>`
  border-radius: 8px !important;
  font-weight: 500 !important;
  
  &.MuiAlert-standardSuccess {
    background-color: #4caf50 !important;
    color: #fff !important;
  }
  
  &.MuiAlert-standardError {
    background-color: #f44336 !important;
    color: #fff !important;
  }
  
  &.MuiAlert-standardInfo {
    background-color: #2196f3 !important;
    color: #fff !important;
  }
`;

interface CreateSurveyFormProps {
  onSave: (questionsList: string[]) => Promise<void>;
}

const CreateSurveyForm: React.FC<CreateSurveyFormProps> = ({ onSave }) => {
  const [question, setQuestion] = useState<string>('');
  const [questionsList, setQuestionsList] = useState<string[]>([]);

  const handleAddQuestion = () => {
    if (question.trim()) {
      setQuestionsList([...questionsList, question.trim()]);
      setQuestion('');
    }
  };

  const handleSave = async () => {
    if (questionsList.length > 0) {
      await onSave(questionsList);
      setQuestionsList([]);
    }
  };

  return (
    <Card sx={{ mt: 2, borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Questions
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Enter a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button variant="outlined" onClick={handleAddQuestion}>
            Add Question
          </Button>
          {questionsList.length > 0 && (
            <Box>
              <Typography variant="subtitle1">Questions:</Typography>
              <ul>
                {questionsList.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </Box>
          )}
          <Button variant="contained" onClick={handleSave}>
            Save Questions
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Define SnackbarState interface
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info';
}

const SurveyManager = () => {
  const navigate = useNavigate(); 

  const [questions, setQuestions] = useState<string[]>([]);
  const [emails, setEmails] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [surveys, setSurveys] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<{ surveyId: string; index: number } | null>(null);
  const [editText, setEditText] = useState('');
  const [highlightSurveyId, setHighlightSurveyId] = useState<string>('');
  const [creatingSurvey, setCreatingSurvey] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.companyId) {
      setCompanyId(user.companyId);
      setCompanyName(user.companyName || 'Your Company');
      fetchSurveys(user.companyId);
    }
  }, []);

  const fetchSurveys = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/surveys/${id}`);
      setSurveys(res.data.trends);
    } catch (err) {
      console.error('❌ Failed to fetch surveys:', err);
    }
  };

  // Snackbar handlers
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSaveQuestions = async (questionsList: string[]) => {
    setLoading(true);
    try {
      const payload = {
        companyId,
        title: `Survey ${surveys.length + 1}`
      };
      const { data } = await axiosInstance.post('/surveys/create', payload);

      const surveyId = data.survey._id;
      await axiosInstance.put(`/surveys/${companyId}/${surveyId}`, { questions: questionsList });

      setQuestions(questionsList);
      showSnackbar('Survey created and activated successfully', 'success');
      setHighlightSurveyId(surveyId);
      setCreatingSurvey(false);
      fetchSurveys(companyId);
    } catch (err) {
      console.error('❌ Failed to save questions:', err);
      showSnackbar('Failed to save questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
    if (emailList.length === 0) {
      showSnackbar('Please enter at least one email address', 'error');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/surveys/distribute', {
        emails: emailList,
        surveyId: companyId,
        companyName
      });
      showSnackbar('Survey invitations sent successfully', 'success');
      setEmails(''); // Clear emails after successful send
    } catch (err) {
      console.error('❌ Distribution failed:', err);
      showSnackbar('Failed to send survey invitations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const activateSurvey = async (surveyId: string) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/surveys/${companyId}/${surveyId}/activate`);
      setHighlightSurveyId(surveyId);
      fetchSurveys(companyId);
      showSnackbar('Survey activated successfully', 'success');
    } catch (err) {
      console.error('❌ Activation failed', err);
      showSnackbar('Failed to activate survey', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async (surveyId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this survey?');
    if (!confirm) return;
    
    setLoading(true);
    try {
      await axiosInstance.delete(`/surveys/${companyId}/${surveyId}`);
      showSnackbar('Survey deleted successfully', 'success');
      fetchSurveys(companyId);
    } catch (err) {
      console.error('❌ Failed to delete survey:', err);
      showSnackbar('Failed to delete survey', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (surveyId: string, index: number, current: string) => {
    setEditingIndex({ surveyId, index });
    setEditText(current);
  };

  const handleSaveEdit = async () => {
    if (!editingIndex) return;
    const { surveyId, index } = editingIndex;
    const survey = surveys.find(s => s._id === surveyId);
    if (!survey) return;

    const updatedQuestions = [...survey.questions];
    updatedQuestions[index].text = editText;

    try {
      await axiosInstance.put(`/surveys/${companyId}/${surveyId}`, {
        questions: updatedQuestions.map(q => q.text)
      });
      setEditingIndex(null);
      setEditText('');
      setHighlightSurveyId(surveyId);
      fetchSurveys(companyId);
    } catch (err) {
      console.error('❌ Edit save failed', err);
    }
  };

  const handleDelete = async (surveyId: string, index: number) => {
    const confirm = window.confirm('Are you sure you want to delete this question?');
    if (!confirm) return;
    
    setLoading(true);
    try {
      await axiosInstance.delete(`/surveys/${companyId}/${surveyId}/question/${index}`);
      setHighlightSurveyId(surveyId);
      fetchSurveys(companyId);
      showSnackbar('Question deleted successfully', 'success');
    } catch (err) {
      console.error('❌ Question delete failed', err);
      showSnackbar('Failed to delete question', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Manage Surveys
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate('/dashboard/hr-analytics')} 
        sx={{ mb: 2 , mr: 2 }}
      >
        ← Back to HR Analytics
      </Button>
      <Button variant="contained" onClick={() => setCreatingSurvey(!creatingSurvey)} sx={{ mb: 2 }}>
        {creatingSurvey ? 'Cancel' : '➕ Create New Survey'}
      </Button>

      {creatingSurvey && <CreateSurveyForm onSave={handleSaveQuestions} />}

      {surveys.map((s, idx) => (
        <Card key={idx} sx={{ mt: 3, border: s._id === highlightSurveyId ? '2px solid #4caf50' : undefined }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">{s.title}</Typography>
                <Typography color={s.isActive ? 'success.main' : 'text.secondary'}>
                  Status: {s.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
              <IconButton onClick={() => deleteSurvey(s._id)}><Delete /></IconButton>
            </Box>
            <ul>
              {s.questions.map((q: any, i: number) => (
                <li key={i}>
                  {editingIndex && editingIndex.surveyId === s._id && editingIndex.index === i ? (
                    <>
                      <TextField
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton onClick={handleSaveEdit}><Save /></IconButton>
                    </>
                  ) : (
                    <>
                      {q.text} (Avg: {q.avgScore}, Sentiment: {q.sentiment})
                      <IconButton onClick={() => handleEdit(s._id, i, q.text)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(s._id, i)}><Delete /></IconButton>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {!s.isActive && (
              <Button
                startIcon={<CheckCircle />}
                variant="outlined"
                onClick={() => activateSurvey(s._id)}
              >
                Activate This Survey
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {questions.length > 0 && (
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Distribute Survey
            </Typography>
            <TextField
              fullWidth
              label="Enter employee emails (comma-separated)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleDistribute}>
              Send Survey
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading spinner */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {/* Snackbar for notifications */}
      <StyledSnackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <StyledAlert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="standard"
        >
          {snackbar.message}
        </StyledAlert>
      </StyledSnackbar>
    </Box>
  );
};

export default SurveyManager;
