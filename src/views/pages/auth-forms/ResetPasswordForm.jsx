import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, FormControl, InputLabel, OutlinedInput, Typography, Box } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import AnimateButton from 'ui-component/extended/AnimateButton';

export default function ResetPasswordForm() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPasswordReq } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await resetPasswordReq(email);
      if (response.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/pages/check-mail';
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setError(error.message || error.error || 'An error occurred while resetting password, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="email">Your Email Address</InputLabel>
        <OutlinedInput id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
      </FormControl>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success" sx={{ mt: 1 }}>
          Request sent successfully!
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
