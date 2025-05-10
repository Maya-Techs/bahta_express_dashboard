import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';

import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertCategoryDelete from './AlertCategoryDelete';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';

import { createCategory, updateCategory } from '../../api/category';

// assets
import { IconBug } from '@tabler/icons-react';

import { Alert } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// CONSTANT
const getInitialValues = (Category) => {
  const newCategory = {
    category_name: '',
    description: ''
  };

  if (Category) {
    return _.merge({}, newCategory, Category);
  }

  return newCategory;
};

export const CompanyRoles = [{ value: 1, label: 'Admin' }];

export default function FormCategoryAdd({ Category, closeModal }) {
  const theme = useTheme();
  const { user } = useAuth();
  const user_id = user.user_id;
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const CategorySchema = Yup.object().shape({
    category_name: Yup.string().max(255).required('Category Name is required'),
    description: Yup.string().max(255).required('Description is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(Category),
    validationSchema: CategorySchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newCategory = values;
        let Data = {
          category_name: newCategory.category_name,
          description: newCategory.description
        };
        if (Category) {
          updateCategory(newCategory.category_id, Data).then(() => {
            setSubmitting(false);
            closeModal();
          });
        } else {
          const res = await createCategory(Data);
          if (res.error) {
            setError(res.error);
          } else {
            setSubmitting(false);
            closeModal();
          }
        }
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  if (loading)
    return (
      <Box sx={{ p: 1 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            autoComplete="off"
            sx={{
              overflow: 'auto'
            }}
            noValidate
            onSubmit={handleSubmit}
          >
            <DialogTitle>{user ? 'Edit Category' : 'New Category'}</DialogTitle>
            <Divider />
            {error && (
              <Alert color="error" variant="outlined" icon={<IconBug />}>
                {error}
              </Alert>
            )}
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} md={8}>
                  <Grid container justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="category_name">Category Name</InputLabel>
                        <TextField
                          fullWidth
                          id="category_name"
                          placeholder="Enter Category Name"
                          {...getFieldProps('category_name')}
                          error={Boolean(touched.category_name && errors.category_name)}
                          helperText={touched.category_name && errors.category_name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <TextField
                          fullWidth
                          id="description"
                          placeholder="Enter description"
                          {...getFieldProps('description')}
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {Category ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {Category && <AlertCategoryDelete id={Category.id} title={Category.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}

FormCategoryAdd.propTypes = { Category: PropTypes.any, closeModal: PropTypes.func };
