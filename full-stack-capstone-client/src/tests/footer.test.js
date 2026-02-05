import React from 'react';
import { render, screen } from './test-utils';
import Footer from '../shared/components/Footer';

describe('<Footer />', () => {
  it('Should render without crashing', () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright/i)).toBeInTheDocument();
  });

  it('Should display copyright information', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('Should display app name', () => {
    render(<Footer />);
    expect(screen.getByText(/educationELLy/i)).toBeInTheDocument();
  });

  it('Should render as fixed footer', () => {
    const { container } = render(<Footer />);
    const footer = container.firstChild;
    expect(footer).toHaveStyle('position: fixed');
    expect(footer).toHaveStyle('bottom: 0');
  });
});
