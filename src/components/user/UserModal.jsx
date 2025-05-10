import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormUserAdd from './FormUserAdd';
import MainCard from '../../ui-component/cards/MainCard';
import SimpleBar from '../../ui-component/third-party/SimpleBar';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { useGetUsers } from '../../api/user';

// ==============================|| User ADD / EDIT ||============================== //

export default function UserModal({ open, modalToggler, User }) {
  const { UsersLoading: loading } = useGetUsers();

  const closeModal = () => modalToggler(false);

  const UserForm = useMemo(() => !loading && <FormUserAdd User={User || null} closeModal={closeModal} />, [User, loading]);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-User-add-label"
          aria-describedby="modal-User-add-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MainCard
            sx={{
              width: 'fit-content',
              maxWidth: '90vw',
              height: 'fit-content',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              padding: 0,
              margin: 0
            }}
            modal
            content={false}
          >
            {loading ? (
              <Box sx={{ p: 5 }}>
                <Stack direction="row" justifyContent="center">
                  <CircularWithPath />
                </Stack>
              </Box>
            ) : (
              UserForm
            )}
          </MainCard>
        </Modal>
      )}
    </>
  );
}

UserModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, User: PropTypes.any };
