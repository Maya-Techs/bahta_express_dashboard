import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Typography, Box, TextField } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from '../../../hooks/useAuth';

export default function CodeVerificationForm() {
  const theme = useTheme();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const { verifyOtp, resendOtp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendOtpError, setResendOtpError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resend, setResendOtp] = useState(false);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const OTPCode = code.join('');

    if (OTPCode.length === 0) {
      setOtpError('Please enter a code');
      setTimeout(() => {
        setOtpError('');
      }, 2000);
      return;
    }
    if (OTPCode.length < 6) {
      setOtpError('Please enter a 6-digit OTP');
      setTimeout(() => {
        setOtpError('');
      }, 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp(OTPCode);
      if (response.status === 'success') {
        setSuccess('Otp successfully verified!');
        setTimeout(() => {
          setSuccess('Otp successfully verified!');
          window.location.href = '/';
        }, 2000);
        localStorage.removeItem('user_email');
        localStorage.removeItem('auth_msg');
      } else {
        setServerError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setServerError(error.message);
      setTimeout(() => {
        setServerError('');
        setOtpError('');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    setCode(pasteData.concat(Array(6 - pasteData.length).fill('')));
    inputRefs.current[pasteData.length - 1]?.focus();
  };

  const handleResendOtp = async () => {
    setResendOtp(true);
    try {
      const res = await resendOtp();
      if (res.status === 'success') {
        setResendSuccess(res.message);
        setTimeout(() => {
          setResendSuccess('');
        }, 6000);
      } else if (res.status === 'fail') {
        setResendOtpError(res.message);
        setTimeout(() => {
          setResendOtpError('');
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      setResendOtpError(error.message || error.error);
      setTimeout(() => {
        setResendOtpError('');
      }, 4000);
    } finally {
      setResendOtp(false);
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <Grid container spacing={0.5} justifyContent="center">
        {code.map((digit, index) => (
          <Grid item key={index}>
            <TextField
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              variant="outlined"
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <AnimateButton>
          <Button color="secondary" sx={{ mt: 1 }} fullWidth size="large" type="submit" variant="contained">
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </Button>
        </AnimateButton>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {resendOtpError && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {resendOtpError}
          </Typography>
        )}
        {resendSuccess && (
          <Typography color="success" align="center" sx={{ mt: 1 }}>
            {resendSuccess}
          </Typography>
        )}
        {success && (
          <Typography color="success" align="center" sx={{ mt: 1 }}>
            {success}
          </Typography>
        )}

        {serverError && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {serverError}
          </Typography>
        )}
        {otpError && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {otpError}
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Didn't receive the code?{' '}
          <Button disabled={resend} onClick={() => handleResendOtp()}>
            {resend ? 'Resending...' : 'Resend'}
          </Button>
        </Typography>
      </Box>
    </form>
  );
}
