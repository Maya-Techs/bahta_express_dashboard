import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormClientAdd from './FormClientAdd';
import MainCard from '../../ui-component/cards/MainCard';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { useGetClients } from '../../api/client';

export default function ClientModal({ open, modalToggler, Client }) {
  const { ClientsLoading: loading } = useGetClients();

  const closeModal = () => modalToggler(false);

  const ClientForm = useMemo(() => !loading && <FormClientAdd client={Client || null} closeModal={closeModal} />, [Client, loading]);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-Client-add-label"
          aria-describedby="modal-Client-add-description"
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
              ClientForm
            )}
          </MainCard>
        </Modal>
      )}
    </>
  );
}

ClientModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, Client: PropTypes.any };
