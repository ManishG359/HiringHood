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
const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12) !important;
  background: #FAFFCA !important;
  transition: background 0.2s;
  &:hover {
    background: #fff !important;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 6px 16px !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
  min-height: 36px !important;
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
    color: #fff !important;
    box-shadow: none !important;
  }
`;

const OutlinedButton = styled(Button)`
  border: 2px solid #5A827E !important;
  color: #5A827E !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 6px 16px !important;
  margin: 0.5rem 0 !important;
  background: #fff !important;
  min-height: 36px !important;
  &:hover {
    background: #e6f2ee !important;
    border-color: #1976d2 !important;
    color: #1976d2 !important;
  }
`;

const SectionTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  text-align: center;
`;

const CardTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  text-align: center;
`;


const StyledStack = styled(Stack)`
  gap: 1.5rem;
  margin-top: 1.5rem;
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
    
    <StyledCard sx={{ mt: 2 }}>
      <CardContent>
        <CardTitle variant="h6" gutterBottom>
          Add Questions
        </CardTitle>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Enter a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <OutlinedButton onClick={handleAddQuestion}>
            Add Question
          </OutlinedButton>
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
          <StyledButton onClick={handleSave}>
            Save Questions
          </StyledButton>
        </Stack>
      </CardContent>
    </StyledCard>

  );
};

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
    <PageBackground>
      <StyledStack>
  <Box>
    <SectionTitle variant="h4" gutterBottom>
      Manage Surveys
    </SectionTitle>
    <OutlinedButton
      onClick={() => navigate('/dashboard/hr-analytics')} 
      sx={{ mb: 2 , mr: 2 }}
    >
      ← Back to HR Analytics
    </OutlinedButton>
    <StyledButton onClick={() => setCreatingSurvey(!creatingSurvey)} sx={{ mb: 2 }}>
      {creatingSurvey ? 'Cancel' : '➕ Create New Survey'}
    </StyledButton>

    {creatingSurvey && <CreateSurveyForm onSave={handleSaveQuestions} />}

    {surveys.map((s, idx) => (
      <StyledCard key={idx} sx={{ mt: 3, border: s._id === highlightSurveyId ? '2px solid #4caf50' : undefined }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <CardTitle variant="h6">{s.title}</CardTitle>
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
            <OutlinedButton
              startIcon={<CheckCircle />}
              onClick={() => activateSurvey(s._id)}
            >
              Activate This Survey
            </OutlinedButton>
          )}
        </CardContent>
      </StyledCard>
    ))}

    {questions.length > 0 && (
      <StyledCard sx={{ mt: 4 }}>
        <CardContent>
          <CardTitle variant="h6" gutterBottom>
            Distribute Survey
          </CardTitle>
          <TextField
            fullWidth
            label="Enter employee emails (comma-separated)"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            sx={{ mb: 2 }}
          />
          <StyledButton onClick={handleDistribute}>
            Send Survey
          </StyledButton>
        </CardContent>
      </StyledCard>
    )}

    {loading && (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    )}

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
  </StyledStack>
  </PageBackground>
);
};
export default SurveyManager;