import { useState } from 'react';
import {
  Box,
  List,
  Grid,
  Stack,
  Button,
  ListItem,
  InputLabel,
  Typography,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  Alert,
  IconButton
} from '@mui/material';
import { IconEye, IconCheckbox as IconCheckbox, IconEyeOff, IconMinus } from '@tabler/icons-react';
import MainCard from '../../ui-component/MainCard';
import useAuth from '../../hooks/useAuth';
import { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength } from '../../views/utilities/validations/passValidation';
import AnimateButton from '../../ui-component/extended/AnimateButton';

export default function AccountTabPassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const togglePasswordVisibility = (setter) => () => setter((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword || !oldPassword) {
      setError('Please fill all the required fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      const result = await changePassword({ newPassword, oldPassword });
      if (result.status === 'success') {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(result.message || 'Password Changed Successfully');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Change Password">
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item container spacing={3} xs={12} sm={6}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-old">Old Password</InputLabel>
                <OutlinedInput
                  id="password-old"
                  placeholder="Enter Old Password"
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility(setShowOldPassword)}>
                        {showOldPassword ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-new">New Password</InputLabel>
                <OutlinedInput
                  id="password-new"
                  placeholder="Enter New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility(setShowNewPassword)}>
                        {showNewPassword ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-confirm">Confirm Password</InputLabel>
                <OutlinedInput
                  id="password-confirm"
                  placeholder="Enter Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility(setShowConfirmPassword)}>
                        {showConfirmPassword ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Stack>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="h5">New Password must contain:</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>{minLength(newPassword) ? <IconCheckbox /> : <IconMinus />}</ListItemIcon>
                  <ListItemText primary="At least 8 characters" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isLowercaseChar(newPassword) ? <IconCheckbox /> : <IconMinus />}</ListItemIcon>
                  <ListItemText primary="At least 1 lowercase letter" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isUppercaseChar(newPassword) ? <IconCheckbox /> : <IconMinus />}</ListItemIcon>
                  <ListItemText primary="At least 1 uppercase letter" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isNumber(newPassword) ? <IconCheckbox /> : <IconMinus />}</ListItemIcon>
                  <ListItemText primary="At least 1 number" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isSpecialChar(newPassword) ? <IconCheckbox /> : <IconMinus />}</ListItemIcon>
                  <ListItemText primary="At least 1 special character" />
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <AnimateButton>
                <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Changing...' : ' Change Password'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
