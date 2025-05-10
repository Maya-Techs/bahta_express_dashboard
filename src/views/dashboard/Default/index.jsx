import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';
import TotalLightCard from '../../../ui-component/cards/TotalLightCard';

import { gridSpacing } from 'store/constant';
// assets
import ReportDarkCard from '../../../ui-component/cards/ReportInfoCard';
import StatCard from './StatCard';
import { IconArticle, IconBriefcase, IconCalendarWeek, IconCategory, IconTag, IconUsers, IconUserSquareRounded } from '@tabler/icons-react';
import { Avatar, Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from '@mui/material';
import { Link } from 'react-router';
import { ArrowForward } from '@mui/icons-material';
import { useGetAdminPortfolios } from '../../../api/portfolio';
import { useGetStats } from '../../../api/dashboard';
import NoData from '../../errors/noData';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { stats } = useGetStats();
  useEffect(() => {
    setLoading(false);
  }, []);
  const { portfolios, loading } = useGetAdminPortfolios();

  const filteredPortfolios = portfolios.filter((portfolio) => portfolio.title.toLowerCase().includes(search.toLowerCase())).slice(0, 9); // Only keep the first 9

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <StatCard
              isLoading={false}
              count={stats?.total_portfolios}
              title="Total Portfolios"
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
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Box p={3}>
              {/* Top Bar */}
              <Box display="flex" justifyContent="space-between" mb={4}>
                <TextField
                  label="Search Portfolios"
                  variant="outlined"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  sx={{ width: '50%' }}
                />
              </Box>

              <Grid container spacing={4}>
                {filteredPortfolios.map((portfolio) => (
                  <Grid item xs={12} sm={6} md={4} key={portfolio.portfolio_id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={`${import.meta.env.VITE_APP_BASE_URL}/public/uploads/images/portfolio/${portfolio.image_url}`}
                        alt={portfolio.title}
                      />
                      <Box
                        sx={{
                          borderTopRightRadius: 5,
                          textAlign: 'center',
                          bgcolor: 'white',
                          position: 'relative',
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          flex: 'row',
                          gap: 0.2,
                          left: 0,
                          bottom: 33,
                          zIndex: 1,
                          width: 150,
                          height: 35,
                          pt: 1
                        }}
                      >
                        <IconCalendarWeek size={18} color="#FF704A" />
                        <Typography>
                          {new Date(portfolio.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>

                      <CardContent>
                        <Box sx={{ display: 'flex', flex: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: 19 }} variant="h3" noWrap>
                            <a
                              style={{ textDecoration: 'none', color: '#080A3C' }}
                              href={`https://bahtaexpress.com/portfolio/details/${portfolio.post_id}`}
                            >
                              {portfolio.title}
                            </a>
                          </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center" className="post-info" marginTop={3}>
                          <Box display="flex" alignItems="center" className="post-by">
                            <Avatar
                              alt="Author Avatar"
                              src={`https://avatar.iran.liara.run/username?username=${portfolio.client_name}`}
                              sx={{ width: 45, height: 45, marginRight: 2 }}
                            />
                            <Typography variant="h6">{portfolio.client_name}</Typography>
                          </Box>

                          <Box className="details-btn">
                            <a href={`http://maya-techs.com/portfolio/details/${portfolio.post_id}`} passHref>
                              <IconButton component="a">
                                <ArrowForward />
                              </IconButton>
                            </a>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                <NoData length={portfolios.length} message="No Records Found" />
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
