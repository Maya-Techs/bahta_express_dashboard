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
import AlertServiceDelete from './AlertServiceDelete';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';

import { createService, updateService } from '../../api/service';

// assets
import { IconBug } from '@tabler/icons-react';

import { Alert } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// CONSTANT
const getInitialValues = (Service) => {
  const newService = {
    service_name: ''
  };

  if (Service) {
    return _.merge({}, newService, Service);
  }

  return newService;
};

export const CompanyRoles = [{ value: 1, label: 'Admin' }];

export default function FormServiceAdd({ Service, closeModal }) {
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

  const ServiceSchema = Yup.object().shape({
    service_name: Yup.string().max(255).required('Service Name is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(Service),
    validationSchema: ServiceSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newService = values;
        let Data = {
          service_name: newService.service_name
        };
        if (Service) {
          updateService(newService.service_id, Data).then(() => {
            setSubmitting(false);
            closeModal();
          });
        } else {
          const res = await createService(Data);
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
            <DialogTitle>{Service ? 'Edit Service' : 'New Service'}</DialogTitle>
            <Divider />
            {error && (
              <Alert color="error" variant="outlined" icon={<IconBug />}>
                {error}
              </Alert>
            )}
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} md={12}>
                  <Grid container justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="service_name">Service Name</InputLabel>
                        <TextField
                          fullWidth
                          id="service_name"
                          placeholder="Enter Service Name"
                          {...getFieldProps('service_name')}
                          error={Boolean(touched.service_name && errors.service_name)}
                          helperText={touched.service_name && errors.service_name}
                        />
                      </Stack>
                    </Grid>{' '}
                    <Grid item xs={12}>
                      <Stack fullWidth spacing={1}></Stack>
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
                      {Service ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {Service && <AlertServiceDelete id={Service.id} title={Service.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}

FormServiceAdd.propTypes = { Service: PropTypes.any, closeModal: PropTypes.func };
