import React from 'react';
import { Box, Typography } from '@mui/material';
import { IconPlaylistX } from '@tabler/icons-react';

const NoData = ({ message = 'No Records Found', length, loading }) => {
  const isEmpty = typeof length === 'number' ? length === 0 : Object.values(length).every((val) => val === 0);

  // ✅ Prevent showing while data is loading
  if (loading || !isEmpty) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px" textAlign="center" width="100%">
      <IconPlaylistX size="68" color="#888" />
      <Typography variant="h2" color="text.secondary" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default NoData;
