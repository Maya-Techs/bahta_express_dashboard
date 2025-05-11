import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';

import { updateQuote } from '../../api/quote';

// assets
import { IconBug } from '@tabler/icons-react';

import { Alert } from '@mui/material';

// CONSTANT
const getInitialValues = (Quote) => {
  const newQuote = {
    quote_name: '',
    description: ''
  };

  if (Quote) {
    return _.merge({}, newQuote, Quote);
  }

  return newQuote;
};

export const CompanyRoles = [{ value: 1, label: 'Admin' }];

export default function FormQuoteAdd({ Quote, closeModal }) {
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

  const QuoteSchema = Yup.object().shape({
    first_name: Yup.string().max(255).required('First Name is required'),
    last_name: Yup.string().max(255).required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone_number: Yup.string().max(20).required('Phone number is required'),
    origin_address: Yup.string().max(255).required('Origin address is required'),
    destination_address: Yup.string().max(255).required('Destination address is required'),
    weight_kg: Yup.number().required('Weight is required'),
    dimensions: Yup.string().max(255).required('Dimensions are required'),
    number_of_pieces: Yup.number().required('Number of pieces is required'),
    commodity: Yup.string().max(255).required('Commodity is required'),
    additional_info: Yup.string().max(255)
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: {
      first_name: Quote?.first_name || '',
      last_name: Quote?.last_name || '',
      email: Quote?.email || '',
      phone_number: Quote?.phone_number || '',
      origin_address: Quote?.origin_address || '',
      destination_address: Quote?.destination_address || '',
      weight_kg: Quote?.weight_kg || '',
      dimensions: Quote?.dimensions || '',
      number_of_pieces: Quote?.number_of_pieces || '',
      commodity: Quote?.commodity || '',
      additional_info: Quote?.additional_info || ''
    },
    validationSchema: QuoteSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newQuote = values;
        let Data = {
          first_name: newQuote.first_name,
          last_name: newQuote.last_name,
          email: newQuote.email,
          phone_number: newQuote.phone_number,
          origin_address: newQuote.origin_address,
          destination_address: newQuote.destination_address,
          weight_kg: newQuote.weight_kg,
          dimensions: newQuote.dimensions,
          number_of_pieces: newQuote.number_of_pieces,
          commodity: newQuote.commodity,
          additional_info: newQuote.additional_info
        };
        if (Quote) {
          await updateQuote(Quote.quote_id, Data).then(() => {
            setSubmitting(false);
            closeModal();
          });
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
            <DialogTitle>{Quote ? 'Edit Quote' : 'New Quote'}</DialogTitle>
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
                        <InputLabel htmlFor="first_name">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="first_name"
                          placeholder="Enter First Name"
                          {...getFieldProps('first_name')}
                          error={Boolean(touched.first_name && errors.first_name)}
                          helperText={touched.first_name && errors.first_name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="last_name">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="last_name"
                          placeholder="Enter Last Name"
                          {...getFieldProps('last_name')}
                          error={Boolean(touched.last_name && errors.last_name)}
                          helperText={touched.last_name && errors.last_name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="email"
                          placeholder="Enter Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                        <TextField
                          fullWidth
                          id="phone_number"
                          placeholder="Enter Phone Number"
                          {...getFieldProps('phone_number')}
                          error={Boolean(touched.phone_number && errors.phone_number)}
                          helperText={touched.phone_number && errors.phone_number}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="origin_address">Origin Address</InputLabel>
                        <TextField
                          fullWidth
                          id="origin_address"
                          placeholder="Enter Origin Address"
                          {...getFieldProps('origin_address')}
                          error={Boolean(touched.origin_address && errors.origin_address)}
                          helperText={touched.origin_address && errors.origin_address}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="destination_address">Destination Address</InputLabel>
                        <TextField
                          fullWidth
                          id="destination_address"
                          placeholder="Enter Destination Address"
                          {...getFieldProps('destination_address')}
                          error={Boolean(touched.destination_address && errors.destination_address)}
                          helperText={touched.destination_address && errors.destination_address}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="weight_kg">Weight (kg)</InputLabel>
                        <TextField
                          fullWidth
                          id="weight_kg"
                          type="number"
                          placeholder="Enter Weight"
                          {...getFieldProps('weight_kg')}
                          error={Boolean(touched.weight_kg && errors.weight_kg)}
                          helperText={touched.weight_kg && errors.weight_kg}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                        <TextField
                          fullWidth
                          id="dimensions"
                          placeholder="Enter Dimensions"
                          {...getFieldProps('dimensions')}
                          error={Boolean(touched.dimensions && errors.dimensions)}
                          helperText={touched.dimensions && errors.dimensions}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="number_of_pieces">Number of Pieces</InputLabel>
                        <TextField
                          fullWidth
                          id="number_of_pieces"
                          type="number"
                          placeholder="Enter Number of Pieces"
                          {...getFieldProps('number_of_pieces')}
                          error={Boolean(touched.number_of_pieces && errors.number_of_pieces)}
                          helperText={touched.number_of_pieces && errors.number_of_pieces}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="commodity">Commodity</InputLabel>
                        <TextField
                          fullWidth
                          id="commodity"
                          placeholder="Enter Commodity"
                          {...getFieldProps('commodity')}
                          error={Boolean(touched.commodity && errors.commodity)}
                          helperText={touched.commodity && errors.commodity}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="additional_info">Additional Info</InputLabel>
                        <TextField
                          fullWidth
                          id="additional_info"
                          placeholder="Enter Additional Info"
                          {...getFieldProps('additional_info')}
                          error={Boolean(touched.additional_info && errors.additional_info)}
                          helperText={touched.additional_info && errors.additional_info}
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
                <Grid item xs={12} sm={8} sx={{ display: 'flex' }}></Grid>
                <Grid item xs={12} sm={4}>
                  <Button fullWidth variant="contained" type="submit" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Quote'}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
}

FormQuoteAdd.propTypes = { Quote: PropTypes.any, closeModal: PropTypes.func };
