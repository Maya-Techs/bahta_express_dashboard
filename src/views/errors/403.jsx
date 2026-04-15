import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function FORBIDDEN() {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography variant="h2" color="error">
        403 Forbidden
      </Typography>
      <Typography variant="body1" align="center" marginTop={2}>
        You do not have permission to access this page.
      </Typography>
      <Link to="https://bahtaexpress.com/" variant="contained" color="primary" sx={{ marginTop: 3 }}>
        Go to Home
      </Link>
    </Box>
  );
}

export default FORBIDDEN;
