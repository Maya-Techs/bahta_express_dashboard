import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

const gradientMap = {
  primary: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  success: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
  warning: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
  info: 'linear-gradient(135deg, #29B6F6 0%, #0288D1 100%)',
  error: 'linear-gradient(135deg, #EF5350 0%, #D32F2F 100%)'
};

export default function StatCard({ isLoading, count = 0, title = '', icon: Icon, iconColor = 'secondary.800', gradient = 'primary' }) {
  const theme = useTheme();

  const background = gradientMap[gradient] || theme.palette.secondary.dark;

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            background: background,
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.3
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: iconColor,
                      mt: 1
                    }}
                  >
                    {Icon && <Icon fontSize="small" />}
                  </Avatar>
                </Grid>
              </Grid>

              <Grid container alignItems="center" spacing={1} mt={2}>
                <Grid>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 500 }}>{count}</Typography>
                </Grid>
              </Grid>

              <Grid sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'white' }}>{title}</Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

StatCard.propTypes = {
  isLoading: PropTypes.bool,
  count: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  gradient: PropTypes.oneOf(['primary', 'success', 'warning', 'info', 'error'])
};
