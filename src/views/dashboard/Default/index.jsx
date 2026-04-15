import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';
import TotalLightCard from '../../../ui-component/cards/TotalLightCard';

import { gridSpacing } from 'store/constant';
// assets
import ReportDarkCard from '../../../ui-component/cards/ReportInfoCard';
import StatCard from './StatCard';
import { IconArticle, IconBriefcase, IconCalendarWeek, IconCategory, IconTag, IconTruckDelivery, IconUsers, IconUserSquareRounded } from '@tabler/icons-react';
import { Avatar, Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from '@mui/material';
import { Link } from 'react-router';
import { ArrowForward } from '@mui/icons-material';
import { useGetStats } from '../../../api/dashboard';
import NoData from '../../errors/noData';
import QuotesListPage from '../../pages/apps/quote/list';
import QuoteStats from './QuoteStats';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { stats } = useGetStats();
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <StatCard
              isLoading={false}
              count={stats?.total_quotes}
              title="Total Quotes"
              icon={IconBriefcase}
              iconColor="white"
              gradient=""
            />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <StatCard
              isLoading={false}
              count={stats?.total_blogs}
              title="Total Blogs"
              icon={IconArticle}
              iconColor="white"
              gradient="success"
            />
          </Grid>

          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <Grid container spacing={gridSpacing}>
                  <TotalLightCard
                    {...{
                      isLoading: isLoading,
                      total: stats?.total_clients,
                      label: 'Total Clients',
                      icon: <IconUserSquareRounded fontSize="inherit" />
                    }}
                  />
                  <TotalLightCard
                    {...{
                      isLoading: isLoading,
                      total: stats?.total_users,
                      label: 'Total Users',
                      icon: <IconUsers fontSize="inherit" />
                    }}
                  />
                </Grid>
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <Grid container spacing={gridSpacing}>
                  <ReportDarkCard count={stats?.total_categories} label="Total Categ" icon={<IconCategory />} />
                  <ReportDarkCard count={stats?.total_tags} label="Total Tags" icon={<IconTag />} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
        <StatCard
          isLoading={false}
          count={stats?.total_quotes_today}
          title="Quotes Submitted Today"
          icon={IconTruckDelivery}
          iconColor="white"
          gradient="info"
        />
      </Grid>
      <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
        <StatCard
          isLoading={false}
          count={stats?.total_quotes_current_week}
          title="Quotes Submitted This Week"
          icon={IconTruckDelivery}
          iconColor="white"
          gradient="info"
        />
      </Grid>
      <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
        <StatCard
          isLoading={false}
          count={stats?.total_services}
          title="Total Services"
          icon={IconArticle}
          iconColor="white"
          gradient="blue"
        />
      </Grid>
      <QuoteStats
        totalApproved={stats?.total_approved_quotes}
        totalPending={stats?.total_pending_quotes}
        totalRejected={stats?.total_rejected_quotes}
      />
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Box p={3}>
              <Box display="flex" justifyContent="space-between" mb={4}></Box>
              <Grid container spacing={12}>
                <QuotesListPage />
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
