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
import { Checkbox, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { IconUserFilled } from '@tabler/icons-react';
import { updateQuoteStatus } from '../../api/quote';
import { useState } from 'react';

// ==============================|| COMPANY - VIEW ||============================== //
const STATUSES = ['pending', 'approved', 'rejected'];

export default function QuoteView({ data }) {
  // updateQuoteStatus(theQId, Data)
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const [status, setStatus] = useState(data.status);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    const response = await updateQuoteStatus(data.quote_id, { status: newStatus });
    if (response.error) {
      console.error('Failed to update:', response.error);
    }
  };
  return (
    <Transitions2 type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
          <MainCard sx={{ position: 'relative', p: 3 }}>
            <Chip
              label={status}
              size="small"
              color={getStatusColor(status)}
              sx={{ position: 'absolute', right: 16, top: 16, fontSize: '0.675rem' }}
            />

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Stack spacing={2} alignItems="center">
                  <IconUserFilled />
                  <Typography variant="h5" align="center">
                    {data.first_name} {data.last_name}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1.5} alignItems="center">
                  <Typography variant="h5">{data.email}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Additional Info
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {data.additional_info || 'No info available.'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Stack alignItems="center">
                  <Select size="small" value={status} onChange={handleStatusChange}>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
          <Stack spacing={2.5}>
            <MainCard title="Personal Information">
              <List sx={{ py: 0 }}>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Full Name</Typography>
                        <Typography>
                          {data.first_name} {data.last_name}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Phone Number</Typography>
                        <Typography>{data.phone_number}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{data.email}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>

            <MainCard title="Services">
              <List sx={{ py: 0 }}>
                {data.services?.map((service, index) => (
                  <ListItem key={index}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Checkbox checked />
                      <Typography>{service}</Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </MainCard>

            <MainCard title="Shipping Details">
              <List sx={{ py: 0 }}>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Origin Address/Country:</Typography>
                        <Grid item>
                          <Typography>{data.origin_address}</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Destination Address/Country:</Typography>
                        <Grid item>
                          <Typography>{data.destination_address}</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
            <MainCard title="Cargo Details">
              <List sx={{ py: 0 }}>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Weight (kg):</Typography>
                        <Grid item>
                          <Typography>{data.weight_kg}</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Dimensions (LxWxH):</Typography>
                        <Grid item>
                          <Typography>{data.dimensions}</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Number of Pieces:</Typography>
                        <Grid item>
                          <Typography>{data.number_of_pieces}</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Commodity:</Typography>
                        <Grid item>
                          <Typography>{data.commodity}</Typography>
                        </Grid>
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

QuoteView.propTypes = { data: PropTypes.any };
