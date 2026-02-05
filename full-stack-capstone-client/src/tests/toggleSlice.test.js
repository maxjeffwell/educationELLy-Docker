import toggleReducer, {
  toggleSidebar,
  setSidebarOpen,
  closeSidebar,
  openSidebar,
  selectIsSidebarToggled,
} from '../features/dashboard/toggleSlice';

describe('toggleSlice', () => {
  describe('reducer actions', () => {
    it('should return initial state (false)', () => {
      const result = toggleReducer(undefined, { type: '' });
      expect(result).toBe(false);
    });

    it('should toggle from false to true', () => {
      const result = toggleReducer(false, toggleSidebar());
      expect(result).toBe(true);
    });

    it('should toggle from true to false', () => {
      const result = toggleReducer(true, toggleSidebar());
      expect(result).toBe(false);
    });

    it('should set sidebar open with setSidebarOpen(true)', () => {
      const result = toggleReducer(false, setSidebarOpen(true));
      expect(result).toBe(true);
    });

    it('should set sidebar closed with setSidebarOpen(false)', () => {
      const result = toggleReducer(true, setSidebarOpen(false));
      expect(result).toBe(false);
    });

    it('should close sidebar regardless of current state', () => {
      expect(toggleReducer(true, closeSidebar())).toBe(false);
      expect(toggleReducer(false, closeSidebar())).toBe(false);
    });

    it('should open sidebar regardless of current state', () => {
      expect(toggleReducer(false, openSidebar())).toBe(true);
      expect(toggleReducer(true, openSidebar())).toBe(true);
    });
  });

  describe('selectors', () => {
    it('should select sidebar toggle state when true', () => {
      const state = { isSidebarToggled: true };
      expect(selectIsSidebarToggled(state)).toBe(true);
    });

    it('should select sidebar toggle state when false', () => {
      const state = { isSidebarToggled: false };
      expect(selectIsSidebarToggled(state)).toBe(false);
    });
  });
});
