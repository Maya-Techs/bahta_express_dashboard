import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormQuoteAdd from './FormQuoteAdd';
import MainCard from '../../ui-component/cards/MainCard';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { useGetCategories } from '../../api/category';

export default function QuoteModal({ open, modalToggler, Quote }) {
  const { CategoriesLoading: loading } = useGetCategories();

  const closeModal = () => modalToggler(false);

  const QuoteForm = useMemo(() => !loading && <FormQuoteAdd Quote={Quote || null} closeModal={closeModal} />, [Quote, loading]);

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-Quote-add-label"
          aria-describedby="modal-Quote-add-description"
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
              QuoteForm
            )}
          </MainCard>
        </Modal>
      )}
    </>
  );
}

QuoteModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, Quote: PropTypes.any };
