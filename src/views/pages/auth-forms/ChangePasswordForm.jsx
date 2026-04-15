import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box
} from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function ChangePasswordForm() {
  const theme = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    if (!token) {
      setError('Invalid or missing token.');
      setLoading(false);
      return;
    }
    try {
      const response = await resetPassword(token, newPassword);
      if (response.status === 'success') {
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setTimeout(() => {
          window.location.href = '/pages/login';
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setError(error.message || error.error || 'An error occurred while changing password, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e) => e.preventDefault();

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="new-password">New Password</InputLabel>
        <OutlinedInput
          id="new-password"
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          name="new-password"
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" size="large">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="New Password"
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
        <OutlinedInput
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirm-password"
          required
          label="Confirm Password"
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid></Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="primary" sx={{ mt: 1, textAlign: 'center' }}>
          Password successfully changed. You will be redirected to login shortly.
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
