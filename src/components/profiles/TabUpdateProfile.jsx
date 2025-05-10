import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material';
import userIcon from '../../assets/images/users/boy.png';

// third-party
import { PatternFormat } from 'react-number-format';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

// assets
import { IconMessage, IconUser, IconPhone } from '@tabler/icons-react';

import useAuth from '../../hooks/useAuth';
import axios from '../../utils/axios';
import AnimateButton from '../../ui-component/extended/AnimateButton';
//
export default function AccountTabUpdateProfile() {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { user: userInfo, getProfileDetails, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState('');
  const userId = userInfo?.user_id;

  const fetchProfile = async () => {
    try {
      const profile = await getProfileDetails(userId);
      setUser(profile.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // Removed setUser from the dependency array

  useEffect(() => {
    if (user) {
      setFormData({
        user_first_name: user.user_first_name || '',
        user_last_name: user.user_last_name || '',
        user_email: user.user_email || '',
        user_phone: user.user_phone || '',
        role: user.user_role || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/user/update/${userId}`, formData);

      if (response.status === 200) {
        fetchProfile();
        setSuccess(response.message || 'Profile Updated Successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2.2}>
      <Grid item xs={12} sm={4} md={4} xl={3}>
        <MainCard>
          <Stack spacing={2.5} alignItems="center" sx={{ p: 3 }}>
            <img src={userIcon} width={170} style={{ background: '#E3F2FD', borderRadius: '50%' }} />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">
                {user?.user_first_name} {user?.user_last_name}
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <List component="nav" sx={{ py: 1 }}>
            <ListItem>
              <ListItemIcon>
                <IconMessage size={18} />
              </ListItemIcon>
              <ListItemText primary={user?.user_email} />
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <IconPhone size={18} />
              </ListItemIcon>
              <ListItemText primary={user?.phone} />
            </ListItem> */}
          </List>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <MainCard title="Edit Personal Details">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <List>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    placeholder="First Name"
                    fullWidth
                    name="user_first_name" // Fixed name attribute
                    value={formData?.user_first_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    placeholder="Last Name"
                    fullWidth
                    name="user_last_name" // Fixed name attribute
                    value={formData?.user_last_name}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    placeholder="Phone Number eg. 0912345678"
                    fullWidth
                    name="user_phone" // Fixed name attribute
                    value={formData?.user_phone}
                    onChange={handleChange}
                    InputProps={{
                      inputComponent: PatternFormat,
                      inputProps: { format: '#### ### ###' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField placeholder="Email" fullWidth name="user_email" value={formData?.user_email} onChange={handleChange} />
                  <Typography>If you change your email address, you must log out and log in again!</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField placeholder="Role" fullWidth value={formData?.role} disabled />
                </Grid>
              </Grid>
            </ListItem>
          </List>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="secondary" fullWidth size="large" variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Updating...' : ' Update Profile'}
              </Button>
            </AnimateButton>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
