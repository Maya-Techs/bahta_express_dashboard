import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';

// project imports
import StatCard from './StatCard';
import { IconClockHour4Filled, IconCopyCheckFilled, IconFileDislike } from '@tabler/icons-react';

export default function QuoteStats({ isLoading, totalApproved, totalRejected, totalPending }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <StatCard
          isLoading={isLoading}
          count={totalApproved}
          title="Approved Quotes"
          iconColor="white"
          icon={IconCopyCheckFilled}
          gradient="success"
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <StatCard
          isLoading={isLoading}
          count={totalRejected}
          title="Rejected Quotes"
          iconColor="white"
          icon={IconFileDislike}
          gradient="error"
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <StatCard
          isLoading={isLoading}
          count={totalPending}
          title="Pending Quotes"
          iconColor="white"
          icon={IconClockHour4Filled}
          gradient="warning"
        />
      </Grid>
    </Grid>
  );
}

QuoteStats.propTypes = {
  isLoading: PropTypes.bool,
  totalApproved: PropTypes.number,
  totalRejected: PropTypes.number,
  totalPending: PropTypes.number
};
