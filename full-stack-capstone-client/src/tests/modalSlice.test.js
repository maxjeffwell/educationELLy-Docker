import modalReducer, {
  showModal,
  hideModal,
  selectModal,
  selectModalType,
  selectModalProps,
} from '../store/slices/modalSlice';

describe('modalSlice', () => {
  describe('reducer actions', () => {
    it('should return initial state (null)', () => {
      const result = modalReducer(undefined, { type: '' });
      expect(result).toBe(null);
    });

    it('should show modal with type and props', () => {
      const result = modalReducer(
        null,
        showModal({
          modalType: 'DELETE_STUDENT',
          modalProps: { studentId: '123', studentName: 'John' },
        })
      );

      expect(result).toEqual({
        modalType: 'DELETE_STUDENT',
        modalProps: { studentId: '123', studentName: 'John' },
      });
    });

    it('should show modal with type only (empty props)', () => {
      const result = modalReducer(
        null,
        showModal({
          modalType: 'CONFIRM_ACTION',
        })
      );

      expect(result).toEqual({
        modalType: 'CONFIRM_ACTION',
        modalProps: {},
      });
    });

    it('should replace existing modal with new modal', () => {
      const existingState = {
        modalType: 'OLD_MODAL',
        modalProps: { old: true },
      };

      const result = modalReducer(
        existingState,
        showModal({
          modalType: 'NEW_MODAL',
          modalProps: { new: true },
        })
      );

      expect(result).toEqual({
        modalType: 'NEW_MODAL',
        modalProps: { new: true },
      });
    });

    it('should hide modal (return null)', () => {
      const existingState = {
        modalType: 'SOME_MODAL',
        modalProps: { data: 'test' },
      };

      const result = modalReducer(existingState, hideModal());
      expect(result).toBe(null);
    });

    it('should handle hideModal when already null', () => {
      const result = modalReducer(null, hideModal());
      expect(result).toBe(null);
    });
  });

  describe('selectors', () => {
    const stateWithModal = {
      modals: {
        modalType: 'TEST_MODAL',
        modalProps: { id: 1, name: 'Test' },
      },
    };

    const stateWithoutModal = {
      modals: null,
    };

    it('should select entire modal state', () => {
      expect(selectModal(stateWithModal)).toEqual({
        modalType: 'TEST_MODAL',
        modalProps: { id: 1, name: 'Test' },
      });
    });

    it('should select null when no modal', () => {
      expect(selectModal(stateWithoutModal)).toBe(null);
    });

    it('should select modal type', () => {
      expect(selectModalType(stateWithModal)).toBe('TEST_MODAL');
    });

    it('should select undefined for modal type when no modal', () => {
      expect(selectModalType(stateWithoutModal)).toBe(undefined);
    });

    it('should select modal props', () => {
      expect(selectModalProps(stateWithModal)).toEqual({ id: 1, name: 'Test' });
    });

    it('should select undefined for modal props when no modal', () => {
      expect(selectModalProps(stateWithoutModal)).toBe(undefined);
    });
  });
});
