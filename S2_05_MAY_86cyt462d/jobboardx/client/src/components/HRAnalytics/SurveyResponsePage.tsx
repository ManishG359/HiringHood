import { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Card, CardContent, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes, css } from 'styled-components';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const PageContainer = styled(Container)`
  padding-top: 3rem;
  padding-bottom: 3rem;
  
  @media (max-width: 600px) {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
`;

const StyledCard = styled(Card)<{ isComplete?: boolean }>`
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  ${props => props.isComplete && css`
    animation: ${pulse} 2s infinite;
  `}

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #4a6eda 0%, #8a8cff 100%);
  color: white;
  padding: 1.5rem;
`;

const CardTitle = styled(Typography)`
  font-weight: 700 !important;
  margin-bottom: 0.5rem !important;
`;

const StyledCardContent = styled(CardContent)`
  padding: 2rem !important;
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f0f4ff;
  }
  
  &:last-child {
    margin-bottom: 1.5rem;
  }
  
  &.active {
    animation: ${fadeIn} 0.5s ease-out;
  }
`;

const QuestionText = styled(Typography)`
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
  color: #2c3e50;
`;

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const StarButton = styled.button<{ selected: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0.25rem;
  color: ${props => props.selected ? '#ffc107' : '#e0e0e0'};
  
  &:hover {
    transform: scale(1.2);
  }
  
  &:focus {
    outline: none;
  }
`;

const RatingDescription = styled(Typography)<{ rating: number }>`
  margin-left: 1rem !important;
  font-style: italic;
  color: ${props => {
    if (props.rating <= 0) return '#9e9e9e'; // No selection
    if (props.rating === 1) return '#f44336'; // Very Dissatisfied
    if (props.rating === 2) return '#ff5722'; // Dissatisfied
    if (props.rating === 3) return '#ff9800'; // Neutral
    if (props.rating === 4) return '#8bc34a'; // Satisfied
    return '#4caf50'; // Very Satisfied
  }};
  font-weight: ${props => props.rating > 0 ? '600' : '400'} !important;
  transition: color 0.3s ease;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
`;

const ProgressStep = styled.div<{ active: boolean, completed: boolean }>`
  width: 100%;
  height: 4px;
  background-color: ${props => 
    props.completed ? '#4caf50' : 
    props.active ? '#2196f3' : 
    '#e0e0e0'};
  position: relative;
  
  &:not(:last-child) {
    margin-right: 4px;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => 
      props.completed ? '#4caf50' : 
      props.active ? '#2196f3' : 
      '#e0e0e0'};
  }

  ${props => props.active && css`
    animation: ${pulse} 2s infinite;
  `}
`;

const SubmitButton = styled(Button)<{ isComplete: boolean }>`
  margin-top: 1.5rem !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  background: ${props => props.isComplete ? 
    'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)' : 
    'linear-gradient(135deg, #90a4ae 0%, #b0bec5 100%)'} !important;
  
  ${props => props.isComplete && css`
    animation: ${pulse} 2s infinite;
  `}

  &:hover {
    transform: ${props => props.isComplete ? 'translateY(-3px)' : 'none'};
    box-shadow: ${props => props.isComplete ? 
      '0 6px 12px rgba(76, 175, 80, 0.3)' : 
      'none'} !important;
  }
`;

const ThankYouContainer = styled.div`
  text-align: center;
  padding: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ThankYouIcon = styled(CheckCircleIcon)`
  font-size: 4rem !important;
  color: #4caf50;
  margin-bottom: 1.5rem;
`;


interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, max = 5 }) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  console.log(max);
  const getRatingDescription = (rating: number): string => {
    if (rating === 1) return 'Very Dissatisfied';
    if (rating === 2) return 'Dissatisfied';
    if (rating === 3) return 'Neutral';
    if (rating === 4) return 'Satisfied';
    if (rating === 5) return 'Very Satisfied';
    return 'Select rating';
  };
 
  return (
    <Box>
      <StarRatingContainer>
        {[1, 2, 3, 4, 5].map((rating) => (
          <StarButton
            key={rating}
            selected={rating <= (hoverValue || value)}
            onMouseEnter={() => setHoverValue(rating)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(rating)}
            type="button"
          >
            {rating <= (hoverValue || value) ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
          </StarButton>
        ))}
      </StarRatingContainer>
      <RatingDescription variant="body2" rating={hoverValue || value}>
        {getRatingDescription(hoverValue || value)}
      </RatingDescription>
    </Box>
  );
};

const SurveyResponsePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const companyId = searchParams.get('id');

  const [questions, setQuestions] = useState<string[]>([]);
  const [surveyId, setSurveyId] = useState<string>('');
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchActiveSurvey = async () => {
      try {
        console.log('🌐 Fetching surveys for company:', companyId);
        const res = await axios.get(`/api/surveys/${companyId}`);
        console.log('📦 Full API response:', res.data);
        const surveys = res.data?.trends || [];
        console.log('🧾 Extracted trends:', surveys);
        const active = surveys.find((s: any) => s.isActive);
        console.log('🔍 Active survey found:', active);
        if (active) {
          setSurveyId(active._id);
          const extracted = (active.questions || []).map((q: any) => q.question || q.text);
          console.log('📋 Extracted questions:', extracted);
          setQuestions(extracted);
        } else {
          console.warn('⚠️ No active survey found in trends array');
        }
      } catch (err) {
        console.error('❌ Failed to load active survey:', err);
      }
    };

    if (companyId) fetchActiveSurvey();
  }, [companyId]);

  const handleRatingChange = (question: string, rating: number) => {
    setAnswers(prev => ({ ...prev, [question]: rating }));
    
   
    if (activeQuestion < questions.length - 1) {
      setTimeout(() => {
        setActiveQuestion(activeQuestion + 1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting");
      setSnackbarOpen(true);
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        companyId,
        surveyId,
        responses: Object.entries(answers).map(([question, score]) => ({
          question,
          score,
          employeeId: email || 'anonymous',
        }))
      };
      await axios.post('/api/surveys', payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Survey submit failed:', err);
      setError("Failed to submit survey. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isAllQuestionsAnswered = Object.keys(answers).length === questions.length;

  if (submitted) {
    return (
      <PageContainer maxWidth="sm">
        <StyledCard>
          <ThankYouContainer>
            <ThankYouIcon />
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Thank you for your feedback!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your responses have been submitted successfully. Your input helps us improve our workplace.
            </Typography>
           
          </ThankYouContainer>
        </StyledCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="sm">
      <StyledCard>
        <CardHeader>
          <CardTitle variant="h5">
            Employee Feedback Survey
          </CardTitle>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            Your responses are confidential and will help us improve.
          </Typography>
        </CardHeader>
        
        <StyledCardContent>
          {questions.length > 0 && (
            <ProgressContainer>
              {questions.map((_, idx) => (
                <ProgressStep 
                  key={idx} 
                  active={idx === activeQuestion}
                  completed={answers[questions[idx]] !== undefined}
                />
              ))}
            </ProgressContainer>
          )}
          
          {questions.length === 0 ? (
            surveyId ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : (
              <Box sx={{ 
                padding: 3, 
                textAlign: 'center', 
                border: '1px dashed #e0e0e0', 
                borderRadius: 2,
                my: 2
              }}>
                <Typography color="error" variant="h6" gutterBottom>
                  ⚠️ No Active Survey
                </Typography>
                <Typography color="text.secondary">
                  There is no active survey available at the moment. Please check back later.
                </Typography>
              </Box>
            )
          ) : (
            <>
              {questions.map((question, idx) => (
                <QuestionContainer 
                  key={idx}
                  style={{ 
                    display: idx === activeQuestion ? 'block' : 'none'
                  }}
                  className={idx === activeQuestion ? 'active' : ''}
                >
                  <QuestionText variant="body1">
                    {idx + 1}. {question}
                  </QuestionText>
                  <StarRating 
                    value={answers[question] || 0} 
                    onChange={(value) => handleRatingChange(question, value)}
                  />
                </QuestionContainer>
              ))}
              
              <SubmitButton
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting || !isAllQuestionsAnswered}
                isComplete={isAllQuestionsAnswered}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Submitting...
                  </>
                ) : (
                  isAllQuestionsAnswered ? 'Submit Survey' : `Please Complete All Questions (${Object.keys(answers).length}/${questions.length})`
                )}
              </SubmitButton>
            </>
          )}
        </StyledCardContent>
      </StyledCard>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default SurveyResponsePage;
