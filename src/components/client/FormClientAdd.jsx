import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import {
  Box,
  Grid,
  Stack,
  Button,
  Divider,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { createClient, updateClient } from '../../api/client';
import { IconBug, IconUpload } from '@tabler/icons-react';

const getInitialValues = (client) => {
  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    website: '',
    company_name: '',
    industry: '',
    message: '',
    client_role: '',
    logo: null
  };

  return client ? _.merge({}, defaultValues, client) : defaultValues;
};

export default function FormClientAdd({ client, closeModal }) {
  const theme = useTheme();
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoFileError, setLogoFileError] = useState('');
  useEffect(() => {
    if (client) {
      formik.setValues(getInitialValues(client));
    }
  }, [client]);
  const ClientSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    email: Yup.string().email('Invalid email').notRequired(),
    phone: Yup.string().max(20).notRequired(),
    website: Yup.string().url('Invalid website').notRequired(),
    company_name: Yup.string().required('Company name is required'),
    industry: Yup.string().notRequired(),
    client_role: Yup.string().notRequired(), // new
    message: Yup.string().notRequired()
  });

  const formik = useFormik({
    initialValues: getInitialValues(client),
    validationSchema: ClientSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!client && logoFile === null) {
          setLogoFileError('Logo is required');
          return;
        }
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('website', values.website);
        formData.append('company_name', values.company_name);
        formData.append('industry', values.industry);
        formData.append('client_logo', logoFile);
        formData.append('client_role', values.client_role);
        formData.append('message', values.message);

        let res;
        if (client) {
          formData.append('client_id', client.client_id);
          res = await updateClient(client.client_id, formData);
        } else {
          // Create new client
          res = await createClient(formData);
        }

        if (res.error) {
          setError(res.error);
        } else {
          setSubmitting(false);
          closeModal();
        }
      } catch (err) {
        console.error(err);
        setError(err.error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  // if (loading) {
  //   return (
  //     <Box sx={{ p: 1 }}>
  //       <Stack direction="row" justifyContent="center">
  //         <CircularWithPath />
  //       </Stack>
  //     </Box>
  //   );
  // }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogTitle>{client ? 'Edit Client' : 'New Client'}</DialogTitle>
        <Divider />
        {error && (
          <Alert color="error" variant="outlined" icon={<IconBug />}>
            {error}
          </Alert>
        )}
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={10}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">
                      Name <strong style={{ color: 'red' }}>*</strong>
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="name"
                      placeholder="Enter name"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextField
                      fullWidth
                      id="email"
                      placeholder="Enter email"
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="phone">Phone</InputLabel>
                    <TextField
                      fullWidth
                      id="phone"
                      placeholder="Enter phone number"
                      {...getFieldProps('phone')}
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="website">Website</InputLabel>
                    <TextField
                      fullWidth
                      id="website"
                      placeholder="Enter website URL"
                      {...getFieldProps('website')}
                      error={Boolean(touched.website && errors.website)}
                      helperText={touched.website && errors.website}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="company_name">
                      Company Name <strong style={{ color: 'red' }}>*</strong>
                    </InputLabel>
                    <TextField
                      fullWidth
                      id="company_name"
                      placeholder="Enter company name"
                      {...getFieldProps('company_name')}
                      error={Boolean(touched.company_name && errors.company_name)}
                      helperText={touched.company_name && errors.company_name}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="client_role">Client Role</InputLabel>
                    <TextField
                      fullWidth
                      id="client_role"
                      placeholder="Enter client role"
                      {...getFieldProps('client_role')}
                      error={Boolean(touched.client_role && errors.client_role)}
                      helperText={touched.client_role && errors.client_role}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="message">Message</InputLabel>
                    <TextField
                      fullWidth
                      id="message"
                      placeholder="Enter message"
                      multiline
                      minRows={3}
                      {...getFieldProps('message')}
                      error={Boolean(touched.message && errors.message)}
                      helperText={touched.message && errors.message}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="industry">Industry</InputLabel>
                    <TextField
                      fullWidth
                      id="industry"
                      placeholder="Enter industry"
                      {...getFieldProps('industry')}
                      error={Boolean(touched.industry && errors.industry)}
                      helperText={touched.industry && errors.industry}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="logo">
                      Logo Upload <strong style={{ color: 'red' }}>*</strong>
                    </InputLabel>
                    <Button variant="outlined" component="label" startIcon={<IconUpload />} fullWidth>
                      Upload Logo
                      <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                    </Button>
                    {logoFile && (
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {logoFile.name}
                      </Typography>
                    )}
                  </Stack>
                  {logoFileError && (
                    <Typography variant="caption" color="error">
                      {logoFileError}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Typography sx={{ mt: 3, color: 'indigo' }}>
              Client role and message are required for the client to appear in the "What Clients Say" section.
            </Typography>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item />
            <Grid item>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {client ? 'Edit' : 'Add'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}

FormClientAdd.propTypes = {
  client: PropTypes.any,
  closeModal: PropTypes.func
};
