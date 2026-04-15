import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertTagDelete from './AlertTagDelete';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';

import { createTag, updateTag } from '../../api/tag';

// assets
import { IconBug } from '@tabler/icons-react';

import { Alert } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// CONSTANT
const getInitialValues = (Tag) => {
  const newTag = {
    tag_name: '',
    description: ''
  };

  if (Tag) {
    return _.merge({}, newTag, Tag);
  }

  return newTag;
};

export const CompanyRoles = [{ value: 1, label: 'Admin' }];

export default function FormTagAdd({ Tag, closeModal }) {
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

  const TagSchema = Yup.object().shape({
    tag_name: Yup.string().max(255).required('Tag Name is required'),
    description: Yup.string().max(255).required('Description is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(Tag),
    validationSchema: TagSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newTag = values;
        let Data = {
          tag_name: newTag.tag_name,
          description: newTag.description
        };
        if (Tag) {
          updateTag(newTag.tag_id, Data).then(() => {
            setSubmitting(false);
            closeModal();
          });
        } else {
          const res = await createTag(Data);
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
            <DialogTitle>{user ? 'Edit Tag' : 'New Tag'}</DialogTitle>
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
                        <InputLabel htmlFor="tag_name">Tag Name</InputLabel>
                        <TextField
                          fullWidth
                          id="tag_name"
                          placeholder="Enter Tag Name"
                          {...getFieldProps('tag_name')}
                          error={Boolean(touched.tag_name && errors.tag_name)}
                          helperText={touched.tag_name && errors.tag_name}
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
                      {Tag ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {Tag && <AlertTagDelete id={Tag.id} title={Tag.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}

FormTagAdd.propTypes = { Tag: PropTypes.any, closeModal: PropTypes.func };
