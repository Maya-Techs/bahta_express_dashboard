import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import userIcon from '../../assets/images/users/boy.png';
// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from '../../ui-component/MainCard';

// assets
import { IconMessage, IconUser, IconPhone } from '@tabler/icons-react';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { ListItemText } from '@mui/material';

// ==============================|| ACCOUNT PROFILE - ME ||============================== //

export default function AccountTabProfile() {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { getProfileDetails, user: userInfo } = useAuth();
  const userId = userInfo?.user_id;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfileDetails(userId);
        setUser(profile.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [getProfileDetails]);

  return (
    <Grid container spacing={2.5}>
      {/* Left Section */}
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

      {/* Right Section */}
      <Grid item xs={12} sm={8} md={8} xl={9}>
        <MainCard title="My Profile">
          <List sx={{ py: 1 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Full Name</Typography>
                    <Typography>
                      {user?.user_first_name} {user?.user_last_name}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Father Name</Typography>
                    <Typography>{user?.user_last_name}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Email</Typography>
                    <Typography>{user?.user_email}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Role</Typography>
                    <Typography>{user?.user_role}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </MainCard>
      </Grid>
    </Grid>
  );
}
