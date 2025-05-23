import  { useState } from 'react';
import {
  Box, Button, Card, CardContent, TextField, Typography, IconButton, Stack
} from '@mui/material';
import { FieldArray, Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { Add, Delete } from '@mui/icons-material';

const SurveySchema = Yup.object().shape({
  questions: Yup.array()
    .of(Yup.string().min(5, 'Too short').max(100, 'Too long').required('Required'))
    .min(1, 'At least one question is required')
});

const CreateSurveyForm = ({ onSave }: { onSave: (questions: string[]) => void }) => {
  const [submittedQuestions, setSubmittedQuestions] = useState<string[]>([]);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Create Survey
        </Typography>
        <Formik
          initialValues={{ questions: [''] }}
          validationSchema={SurveySchema}
          onSubmit={(values, { resetForm }) => {
            setSubmittedQuestions(values.questions);
            onSave(values.questions);
            resetForm();
          }}
        >
          {({ values, errors, touched, handleChange }) => {
            const questionErrors = errors.questions as FormikErrors<string[]>;
            const questionTouched = touched.questions as FormikTouched<string[]|undefined>;

            return (
              <Form>
                <FieldArray name="questions">
                  {({ push, remove }) => (
                    <Stack spacing={2}>
                      {values.questions.map((q, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            fullWidth
                            name={`questions[${index}]`}
                            label={`Question ${index + 1}`}
                            value={q}
                            onChange={handleChange}
                            error={Boolean(questionTouched?.[index] && questionErrors?.[index])}
                            helperText={questionTouched?.[index] && questionErrors?.[index]}
                          />
                          {values.questions.length > 1 && (
                            <IconButton onClick={() => remove(index)}>
                              <Delete color="error" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button
                        startIcon={<Add />}
                        onClick={() => push('')}
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Add Question
                      </Button>
                      <Button type="submit" variant="contained">
                        Save Questions
                      </Button>
                    </Stack>
                  )}
                </FieldArray>
              </Form>
            );
          }}
        </Formik>

        {submittedQuestions.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Saved Questions:
            </Typography>
            <ul>
              {submittedQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateSurveyForm;
