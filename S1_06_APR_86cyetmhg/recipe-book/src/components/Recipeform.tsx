
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface RecipeFormProps {
  initialValues: {
    title: string;
    ingredients: string;
    instructions: string;
    imageUrl: string;
  };
  onSubmit: (values: RecipeFormProps['initialValues']) => void;
  mode: 'add' | 'edit';
}

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  ingredients: Yup.string().required('Required'),
  instructions: Yup.string().required('Required'),
  imageUrl: Yup.string().url('Invalid URL').required('Required'),
});

const RecipeForm: React.FC<RecipeFormProps> = ({ initialValues, onSubmit, mode }) => {
  return (
    <div>
      <h1>{mode === 'add' ? 'Add New Recipe 🍽️' : 'Edit Recipe ✏️'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px', }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Title</label>
            <Field name="title" className="input" />
            <ErrorMessage name="title" component="div"  />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Ingredients</label>
            <Field name="ingredients" as="textarea" className="input" rows={4} />
            <ErrorMessage name="ingredients" component="div" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Instructions</label>
            <Field name="instructions" as="textarea" className="input" rows={4} />
            <ErrorMessage name="instructions" component="div"  />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Image URL</label>
            <Field name="imageUrl" className="input" />
            <ErrorMessage name="imageUrl" component="div"  />
          </div>

          <button type="submit" style={{ padding: '8px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px' }}>
            {mode === 'add' ? 'Add Recipe' : 'Update Recipe'}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default RecipeForm;
