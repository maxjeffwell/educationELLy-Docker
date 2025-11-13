import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modals',
  initialState: null,
  reducers: {
    showModal: (state, action) => {
      try {
        const newState = {
          modalType: action.payload.modalType,
          modalProps: action.payload.modalProps || {},
        };
        return newState;
      } catch (error) {
        console.error('🔧 Error in showModal reducer:', error);
        return state;
      }
    },
    hideModal: () => {
      return null;
    },
  },
});

// Export actions
export const { showModal, hideModal } = modalSlice.actions;

// Export reducer
export default modalSlice.reducer;

// Selectors
export const selectModal = state => state.modals;
export const selectModalType = state => state.modals?.modalType;
export const selectModalProps = state => state.modals?.modalProps;
