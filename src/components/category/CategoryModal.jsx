import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormCategoryAdd from './FormCategoryAdd';
import MainCard from '../../ui-component/cards/MainCard';
import CircularWithPath from '../../ui-component/extended/progress/CircularWithPath';
import { useGetCategories } from '../../api/category';


export default function CategoryModal({ open, modalToggler, Category }) {
  const { CategoriesLoading: loading } = useGetCategories();

  const closeModal = () => modalToggler(false);

  const CategoryForm = useMemo(
    () => !loading && <FormCategoryAdd Category={Category || null} closeModal={closeModal} />,
    [Category, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-Category-add-label"
          aria-describedby="modal-Category-add-description"
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
              CategoryForm
            )}
          </MainCard>
        </Modal>
      )}
    </>
  );
}

CategoryModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, Category: PropTypes.any };
