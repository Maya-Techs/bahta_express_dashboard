import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Card, CardMedia, CardContent, Typography, IconButton, Avatar } from '@mui/material';
import { Add, ArrowForward } from '@mui/icons-material';
import { IconCalendarWeek, IconTrash, IconEdit, IconEyeDotted } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAdminPortfolios } from '../../../../api/portfolio'; // Custom hook to fetch portfolios
import AlertPortfolioDelete from '../../../../components/portfolio/AlertPortfolioDelete';
import NoData from '../../../errors/noData';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';

const PortfolioListPage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const [portfolioDeleteId, setPortfolioDeleteId] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const { portfolios, loading } = useGetAdminPortfolios();
  const filteredPortfolios = portfolios.filter((portfolio) => portfolio.title.toLowerCase().includes(search.toLowerCase()));

  return (
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
        {/* <Button variant="contained" startIcon={<Add />}>
          Post New Portfolio
        </Button> */}
        <AnimateButton>
          <Button color="secondary" size="large" startIcon={<Add />} onClick={() => navigate('/post-portfolio')} variant="contained">
            Post New Portfolio
          </Button>
        </AnimateButton>
      </Box>

      <Grid container spacing={3}>
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
                    <Link style={{ textDecoration: 'none', color: '#080A3C' }}>{portfolio.title}</Link>
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
                    <a href={`https://maya-techs.com/portfolio/details/${portfolio.post_id}`}>
                      <IconButton
                        component="a"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-portfolio/${portfolio.post_id}`);
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </a>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="flex-start" mt={2} gap={1}>
                  <a href={`https://maya-techs.com/portfolio/details/${portfolio.post_id}`}>
                    <IconButton color="primary" aria-label="view portfolio">
                      <IconEyeDotted />
                    </IconButton>
                  </a>
                  <IconButton
                    color="secondary"
                    aria-label="edit portfolio"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-portfolio/${portfolio.post_id}`);
                    }}
                  >
                    <IconEdit />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                      setPortfolioDeleteId(portfolio.portfolio_id);
                    }}
                    color="error"
                    aria-label="delete portfolio"
                  >
                    <IconTrash />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!loading && portfolios.length === 0 && <NoData length={portfolios.length} loading={loading} message="No Records Found" />}

        <AlertPortfolioDelete id={Number(portfolioDeleteId)} title={portfolioDeleteId} open={open} handleClose={handleClose} />
      </Grid>
    </Box>
  );
};

export default PortfolioListPage;
