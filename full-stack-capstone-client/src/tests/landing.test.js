import React from 'react';
import { render, screen } from './test-utils';
import Landing from '../components/Landing';

describe('<Landing />', () => {
  it('Should render without crashing', () => {
    render(<Landing />);
    // Landing renders a Container with content
    expect(screen.getByText('educationELLy')).toBeInTheDocument();
  });

  it('Should display the app title', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('educationELLy');
  });

  it('Should display feature list', () => {
    render(<Landing />);
    expect(screen.getByText(/Student data at your fingertips/i)).toBeInTheDocument();
    expect(screen.getByText(/Quickly access student lists/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered Assistant/i)).toBeInTheDocument();
  });

  it('Should display login instructions', () => {
    render(<Landing />);
    expect(screen.getByText(/click the Login link/i)).toBeInTheDocument();
  });

  it('Should display registration instructions', () => {
    render(<Landing />);
    expect(screen.getByText(/Register button/i)).toBeInTheDocument();
  });
});
