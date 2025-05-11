import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

import FormServiceAdd from './FormServiceAdd';
import MainCard from '../../ui-component/cards/MainCard';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { useGetServices } from '../../api/service';

export default function ServiceModal({ open, modalToggler, Service }) {
  const { CategoriesLoading: loading } = useGetServices();

  const closeModal = () => modalToggler(false);

  const ServiceForm = useMemo(() => !loading && <FormServiceAdd Service={Service || null} closeModal={closeModal} />, [Service, loading]);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-Service-add-label"
          aria-describedby="modal-Service-add-description"
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
              ServiceForm
            )}
          </MainCard>
        </Modal>
      )}
    </>
  );
}

ServiceModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, Service: PropTypes.any };
