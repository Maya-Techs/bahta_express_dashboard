import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

// third-party
import { CSVLink } from 'react-csv';

import {  IconDownload } from '@tabler/icons-react';

// ==============================|| CSV EXPORT ||============================== //

export default function CSVExport({ data, filename, headers }) {
  const theme = useTheme();

  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Tooltip title="CSV Export - Make sure you selected rows before export, may you get empty file">
        <IconDownload
          size={28}
          variant="Outline"
          style={{ color: theme.palette.text.secondary, marginTop: 4, marginRight: 4, marginLeft: 4 }}
        />
      </Tooltip>
    </CSVLink>
  );
}

CSVExport.propTypes = { data: PropTypes.array, filename: PropTypes.string, headers: PropTypes.any };
