import PropTypes from 'prop-types';
// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from '../../ui-component/extended/Transitions2';

// icons
import { IconTrash } from '@tabler/icons-react';

// API
import { deleteClient } from '../../api/client'; // update path if needed

export default function AlertClientDelete({ id, title, open, handleClose }) {
  const deleteHandler = async () => {
    await deleteClient(id).then(() => {
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="client-delete-title"
      aria-describedby="client-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <IconTrash />
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            {/* Optional description */}
            {/* <Typography align="center">
              By deleting client <Typography variant="subtitle1" component="span">"{title}"</Typography>,
              all associated data may be removed.
            </Typography> */}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deleteHandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertClientDelete.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};
