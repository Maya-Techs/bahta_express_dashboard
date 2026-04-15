import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormTagAdd from './FormTagAdd';
import MainCard from '../../ui-component/cards/MainCard';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { useGetCategories } from '../../api/category';

export default function TagModal({ open, modalToggler, Tag }) {
  const { CategoriesLoading: loading } = useGetCategories();

  const closeModal = () => modalToggler(false);

  const TagForm = useMemo(() => !loading && <FormTagAdd Tag={Tag || null} closeModal={closeModal} />, [Tag, loading]);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-Tag-add-label"
          aria-describedby="modal-Tag-add-description"
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
              TagForm
            )}
          </MainCard>
        </Modal>
      )}
    </>
  );
}

TagModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, Tag: PropTypes.any };
