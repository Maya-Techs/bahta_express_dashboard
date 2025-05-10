import PropTypes from 'prop-types';
// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
// import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from '../../ui-component/extended/Transitions2';

// import { deleteClient } from 'api/client';

// assets
import { IconTrash } from '@tabler/icons-react';
import { deleteuser } from '../../api/user';

// ==============================|| CLIENT - DELETE ||============================== //

export default function AlertUserDelete({ id, title, open, handleClose }) {
  // add stats for error success

  const deletehandler = async () => {
    await deleteuser(id).then(() => {
      

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
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          {/* <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}> */}
          <IconTrash />
          {/* </Avatar> */}
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                &quot;#{title}&quot;
              </Typography>
              user, all task assigned to that user will also be deleted!
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertUserDelete.propTypes = { id: PropTypes.number, title: PropTypes.string, open: PropTypes.bool, handleClose: PropTypes.func };
