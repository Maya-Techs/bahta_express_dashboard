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

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FieldArray } from 'formik';

import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { updateQuote } from '../../api/quote';
import { IconBug } from '@tabler/icons-react';
import { Alert } from '@mui/material';

const CargoSchema = Yup.object().shape({
  weight_kg: Yup.number().typeError('Weight must be a number').nullable().notRequired(),

  dimensions: Yup.string().max(255, 'Maximum 255 characters').nullable().notRequired(),

  number_of_pieces: Yup.number().typeError('Number of pieces must be a number').nullable().notRequired(),

  commodity: Yup.string().max(255, 'Maximum 255 characters').nullable().notRequired()
});

const QuoteSchema = Yup.object().shape({
  first_name: Yup.string().max(255).required('First Name is required'),
  last_name: Yup.string().max(255).required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone_number: Yup.string().max(20).required('Phone number is required'),
  origin_country: Yup.string().max(255).required('Origin country is required'),
  origin_city: Yup.string().max(255).required('Origin city is required'),
  origin_address: Yup.string().max(255).required('Origin address is required'),
  destination_country: Yup.string().max(255).required('Destination country is required'),
  destination_city: Yup.string().max(255).required('Destination city is required'),
  destination_address: Yup.string().max(255).required('Destination address is required'),
  additional_info: Yup.string().max(255),
  city: Yup.string().max(255),
  address: Yup.string().max(255),
  cargos: Yup.array().of(CargoSchema).min(1, 'At least one cargo is required')
});

export default function FormQuoteAdd({ Quote, closeModal }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const formik = useFormik({
    initialValues: {
      first_name: Quote?.first_name || '',
      last_name: Quote?.last_name || '',
      email: Quote?.email || '',
      phone_number: Quote?.phone_number || '',
      origin_country: Quote?.origin_country || '',
      origin_city: Quote?.origin_city || '',
      origin_address: Quote?.origin_address || '',
      destination_country: Quote?.destination_country || '',
      destination_city: Quote?.destination_city || '',
      destination_address: Quote?.destination_address || '',
      city: Quote?.city || '',
      address: Quote?.address || '',
      weight_kg: Quote?.weight_kg || '',
      dimensions: Quote?.dimensions || '',
      number_of_pieces: Quote?.number_of_pieces || '',
      commodity: Quote?.commodity || '',
      additional_info: Quote?.additional_info || '',
      cargos:
        Quote?.cargos && Quote.cargos.length > 0
          ? Quote.cargos
          : [
              {
                weight_kg: '',
                dimensions: '',
                number_of_pieces: '',
                commodity: ''
              }
            ]
    },
    validationSchema: QuoteSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const Data = { ...values };
        if (Quote) {
          await updateQuote(Quote.quote_id, Data);
        }
        setSubmitting(false);
        closeModal();
      } catch (error) {
        setError(error.message || 'Something went wrong');
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, handleBlur } = formik;

  if (loading)
    return (
      <Box sx={{ p: 1 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ overflow: 'auto' }}>
          <DialogTitle>{Quote ? 'Edit Quote' : 'New Quote'}</DialogTitle>
          <Divider />
          {error && (
            <Alert color="error" variant="outlined" icon={<IconBug />} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12} md={8}>
                <Grid container justifyContent="center" alignItems="center" spacing={3}>
                  {/* Main form fields */}
                  {[
                    { id: 'first_name', label: 'First Name', type: 'text' },
                    { id: 'last_name', label: 'Last Name', type: 'text' },
                    { id: 'email', label: 'Email', type: 'email' },
                    { id: 'phone_number', label: 'Phone Number', type: 'text' },
                    { id: 'origin_country', label: 'Origin Country', type: 'text' },
                    { id: 'origin_city', label: 'Origin City', type: 'text' },
                    { id: 'origin_address', label: 'Origin Address', type: 'text' },
                    { id: 'destination_country', label: 'Destination Country', type: 'text' },
                    { id: 'destination_city', label: 'Destination City', type: 'text' },
                    { id: 'destination_address', label: 'Destination Address', type: 'text' }
                  ].map(({ id, label, type }) => (
                    <Grid item xs={12} key={id}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor={id}>{label}</InputLabel>
                        <TextField
                          fullWidth
                          id={id}
                          type={type}
                          placeholder={`Enter ${label}`}
                          {...getFieldProps(id)}
                          error={Boolean(touched[id] && errors[id])}
                          helperText={touched[id] && errors[id]}
                        />
                      </Stack>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      {/* Cargos FieldArray */}
                      <FieldArray name="cargos">
                        {({ push, remove, form }) => (
                          <>
                            {form.values.cargos.map((cargo, index) => {
                              const weightError = form.errors?.cargos?.[index]?.weight_kg;
                              const weightTouched = form.touched?.cargos?.[index]?.weight_kg;

                              const dimensionsError = form.errors?.cargos?.[index]?.dimensions;
                              const dimensionsTouched = form.touched?.cargos?.[index]?.dimensions;

                              const piecesError = form.errors?.cargos?.[index]?.number_of_pieces;
                              const piecesTouched = form.touched?.cargos?.[index]?.number_of_pieces;

                              const commodityError = form.errors?.cargos?.[index]?.commodity;
                              const commodityTouched = form.touched?.cargos?.[index]?.commodity;

                              return (
                                <Grid container spacing={2} key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
                                  <Grid item xs={12}>
                                    <Stack spacing={1}>
                                      <InputLabel htmlFor={`cargos.${index}.weight_kg`}>Weight (kg)</InputLabel>
                                      <TextField
                                        fullWidth
                                        id={`cargos.${index}.weight_kg`}
                                        name={`cargos.${index}.weight_kg`}
                                        type="number"
                                        placeholder="Enter Weight"
                                        value={cargo.weight_kg}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        error={Boolean(weightTouched && weightError)}
                                        helperText={weightTouched && weightError}
                                      />
                                    </Stack>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Stack spacing={1}>
                                      <InputLabel htmlFor={`cargos.${index}.dimensions`}>Dimensions</InputLabel>
                                      <TextField
                                        fullWidth
                                        id={`cargos.${index}.dimensions`}
                                        name={`cargos.${index}.dimensions`}
                                        placeholder="Enter Dimensions"
                                        value={cargo.dimensions}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        error={Boolean(dimensionsTouched && dimensionsError)}
                                        helperText={dimensionsTouched && dimensionsError}
                                      />
                                    </Stack>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Stack spacing={1}>
                                      <InputLabel htmlFor={`cargos.${index}.number_of_pieces`}>Number of Pieces</InputLabel>
                                      <TextField
                                        fullWidth
                                        id={`cargos.${index}.number_of_pieces`}
                                        name={`cargos.${index}.number_of_pieces`}
                                        type="number"
                                        placeholder="Enter Number of Pieces"
                                        value={cargo.number_of_pieces}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        error={Boolean(piecesTouched && piecesError)}
                                        helperText={piecesTouched && piecesError}
                                      />
                                    </Stack>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Stack spacing={1}>
                                      <InputLabel htmlFor={`cargos.${index}.commodity`}>Commodity</InputLabel>
                                      <TextField
                                        fullWidth
                                        id={`cargos.${index}.commodity`}
                                        name={`cargos.${index}.commodity`}
                                        placeholder="Enter Commodity"
                                        value={cargo.commodity}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        error={Boolean(commodityTouched && commodityError)}
                                        helperText={commodityTouched && commodityError}
                                      />
                                    </Stack>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => remove(index)}
                                      disabled={form.values.cargos.length === 1}
                                    >
                                      Remove Cargo
                                    </Button>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  push({
                                    weight_kg: '',
                                    dimensions: '',
                                    number_of_pieces: '',
                                    commodity: ''
                                  })
                                }
                              >
                                Add Cargo
                              </Button>
                            </div>

                            {typeof errors.cargos === 'string' && <Box sx={{ color: 'error.main', mt: 1 }}>{errors.cargos}</Box>}
                          </>
                        )}
                      </FieldArray>
                    </Stack>
                  </Grid>
                  {/* Additional Info */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="additional_info">Additional Info</InputLabel>
                      <TextField
                        id="additional_info"
                        multiline
                        rows={4}
                        placeholder="Additional Information"
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

          <DialogActions sx={{ px: 3, py: 1 }}>
            <Button variant="outlined" color="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ ml: 1 }}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
}

FormQuoteAdd.propTypes = {
  Quote: PropTypes.object,
  closeModal: PropTypes.func.isRequired
};
