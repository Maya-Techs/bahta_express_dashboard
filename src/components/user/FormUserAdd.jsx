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
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';

import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertUserDelete from './AlertUserDelete';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';

import { createUser, updateUser, useGetUsers } from '../../api/user';

// assets
import { IconBug, IconEye, IconEyeOff } from '@tabler/icons-react';

import { Alert, Checkbox, IconButton, InputAdornment } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// CONSTANT
const getInitialValues = (User) => {
  const newUser = {
    user_first_name: '',
    user_last_name: '',
    user_email: '',
    user_phone: '',
    user_password: '',
    end_date: null,
    is_active: '',
    company_role_id: ''
  };

  if (User) {
    return _.merge({}, newUser, User);
  }

  return newUser;
};

export const CompanyRoles = [
  { value: 2, label: 'Admin' },
  { value: 1, label: 'Employee' }
];

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormUserAdd({ User, closeModal }) {
  const theme = useTheme();
  const { user } = useAuth();
  const user_id = user.user_id;
  const { refreshUsers } = useGetUsers();
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

  const UserSchema = Yup.object().shape({
    user_first_name: Yup.string().max(255).required('First Name is required'),
    user_last_name: Yup.string().max(255).required('Last Name is required'),
    user_email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    is_active: Yup.number().required('Status is required'),
    company_role_id: Yup.string().required('Role is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(User),
    validationSchema: UserSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newUser = values;
        let Data = {
          user_first_name: newUser.user_first_name,
          user_last_name: newUser.user_last_name,
          user_email: newUser.user_email,
          user_phone: newUser.user_phone,
          user_id: newUser.user_id,
          is_active: newUser.is_active,
          company_role_id: newUser.company_role_id,
          user_pass: newUser.user_password
        };
        if (User) {
          updateUser(newUser.user_id, Data).then(() => {
            setSubmitting(false);
            closeModal();
          });
        } else {
          const res = await createUser(Data);
          if (res.error) {
            setError(res.error);
          } else {
            await refreshUsers();
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
            <DialogTitle>{User ? 'Edit User' : 'New User'}</DialogTitle>
            <Divider />
            {error && (
              <Alert color="error" variant="outlined" icon={<IconBug />}>
                {error}
              </Alert>
            )}
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <Typography variant="h3" color="primary">
                      {user?.user_first_name.charAt(0)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-firstName">
                          First Name <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          id="User-firstName"
                          placeholder="Enter First Name"
                          {...getFieldProps('user_first_name')}
                          error={Boolean(touched.user_first_name && errors.user_first_name)}
                          helperText={touched.user_first_name && errors.user_first_name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-lastName">
                          Last Name <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          id="User-lastName"
                          placeholder="Enter Last Name"
                          {...getFieldProps('user_last_name')}
                          error={Boolean(touched.user_last_name && errors.user_last_name)}
                          helperText={touched.user_last_name && errors.user_last_name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={9}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-email">
                          Email <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          id="User-email"
                          placeholder="Enter User Email"
                          {...getFieldProps('user_email')}
                          error={Boolean(touched.user_email && errors.user_email)}
                          helperText={touched.user_email && errors.user_email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-age">
                          Role <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            {...getFieldProps('company_role_id')}
                            onChange={(event) => setFieldValue('company_role_id', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">Select Role</Typography>;
                              }

                              const selectedStatus = CompanyRoles.find((item) => item.value === selected);
                              return <Typography variant="subtitle2">{selectedStatus ? selectedStatus.label : 'Select Role'}</Typography>;
                            }}
                          >
                            {CompanyRoles.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-fatherName">Phone </InputLabel>
                        <TextField
                          fullWidth
                          id="User-fatherName"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('user_phone')}
                          error={Boolean(touched.user_phone && errors.user_phone)}
                          helperText={touched.user_phone && errors.user_phone}
                        />
                      </Stack>
                    </Grid>
                    {!User && (
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="User-fatherName">
                            Password <span style={{ color: 'red' }}>*</span>
                          </InputLabel>
                          <OutlinedInput
                            id="text-adornment-password"
                            type={showPass ? 'text' : 'password'}
                            placeholder="Password"
                            {...getFieldProps('user_password')}
                            error={Boolean(touched.user_password && errors.user_password)}
                            helperText={touched.user_password && errors.user_password}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" edge="end" onClick={handleShowPass} color="secondary">
                                  {showPass ? <IconEye /> : <IconEyeOff />}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </Stack>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="User-gender">Status </InputLabel>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.is_active === 1}
                              onChange={(e) => {
                                formik.setFieldValue('is_active', e.target.checked ? 1 : 0);
                              }}
                              name="is_active"
                              color="success"
                            />
                          }
                          label={formik.values.is_active === 1 ? 'Active' : 'Inactive'}
                        />

                        {touched.is_active && (
                          <Typography variant="body2" sx={{ color: 'red' }}>
                            {errors.is_active}
                          </Typography>
                        )}
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
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {User ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {User && <AlertUserDelete id={User.id} title={User.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}

FormUserAdd.propTypes = { User: PropTypes.any, closeModal: PropTypes.func };
