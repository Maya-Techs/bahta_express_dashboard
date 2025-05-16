import PropTypes from 'prop-types';
import { format } from 'date-fns';
// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import MainCard from '../../ui-component/cards/MainCard';
import Transitions2 from '../../ui-component/extended/Transitions2';
import { Checkbox, MenuItem, Select } from '@mui/material';
import { IconUserFilled } from '@tabler/icons-react';

// ==============================|| COMPANY - VIEW ||============================== //

export default function ClientView({ data }) {
  return (
    <Transitions2 type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
          <MainCard sx={{ position: 'relative', p: 3 }}>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Stack spacing={2} alignItems="center">
                  <img width={100} src={`${import.meta.env.VITE_APP_BASE_URL}/public/uploads/images/ClientLogos/${data.logo_url}`} />
                  <Typography variant="h5" align="center">
                    {data.first_name} {data.last_name}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
          <Stack spacing={2.5}>
            <MainCard title="Client Information">
              <List sx={{ py: 0 }}>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Client Name</Typography>
                        <Typography>{data.name || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Company Name</Typography>
                        <Typography>{data.company_name || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Phone Number</Typography>
                        <Typography>{data.phone || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Industry</Typography>
                        <Typography>{data.industry || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{data.email || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Phone Number</Typography>
                        <Typography>{data.phone || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>{' '}
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Message</Typography>
                        <Typography>{data.message || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Role</Typography>
                        <Typography>{data.client_role || 'Not Provided'}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </Transitions2>
  );
}

ClientView.propTypes = { data: PropTypes.any };
