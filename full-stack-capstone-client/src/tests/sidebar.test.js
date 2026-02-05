import React from 'react';
import { render, screen } from './test-utils';
import Sidebar from '../components/Sidebar';

describe('<Sidebar />', () => {
  it('Should render without crashing', () => {
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('Should render as a grid container', () => {
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('ui', 'grid', 'container');
  });

  it('Should be centered', () => {
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('centered');
  });

  it('Should have single column layout', () => {
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('one', 'column');
  });
});
