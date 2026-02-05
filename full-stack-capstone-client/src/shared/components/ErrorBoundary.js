import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Message,
  Button,
  Segment,
  Icon,
} from 'semantic-ui-react';
import styled from 'styled-components';
import { captureException } from '../../utils/sentry';

/**
 * Error boundary variants for different UI contexts:
 * - 'full': Full page error display (for root/route level)
 * - 'inline': Card-style error within a section (for features)
 * - 'minimal': Compact error message (for small components)
 */

const ErrorCard = styled(Segment)`
  &&& {
    text-align: center;
    padding: 2rem;
    margin: 1rem 0;
  }
`;

const MinimalError = styled.div`
  padding: 1rem;
  color: #9f3a38;
  background: #fff6f6;
  border: 1px solid #e0b4b4;
  border-radius: 4px;
  text-align: center;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const { featureName, onError } = this.props;

    // Log to console with context
    console.error(
      `Error caught by boundary${featureName ? ` [${featureName}]` : ''}:`,
      error,
      errorInfo
    );

    // Store error info for display
    this.setState({ errorInfo });

    // Report to Sentry with context
    captureException(error, {
      extra: {
        componentStack: errorInfo?.componentStack,
        featureName: featureName || 'unknown',
      },
      tags: {
        errorBoundary: featureName || 'root',
      },
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  renderFullError() {
    const { featureName } = this.props;

    return (
      <Container text style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Header as="h2" color="red" icon textAlign="center">
          <Icon name="warning sign" />
          Oops! Something went wrong
        </Header>
        <Message error>
          <Message.Header>An unexpected error occurred</Message.Header>
          <p>
            {featureName ? `There was a problem loading ${featureName}. ` : ''}
            We apologize for the inconvenience. Please try again or refresh the
            page.
          </p>
        </Message>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button primary onClick={this.handleRetry}>
            <Icon name="redo" />
            Try Again
          </Button>
          <Button
            secondary
            onClick={() => window.location.reload()}
            style={{ marginLeft: '10px' }}
          >
            <Icon name="refresh" />
            Refresh Page
          </Button>
        </div>
      </Container>
    );
  }

  renderInlineError() {
    const { featureName } = this.props;

    return (
      <ErrorCard raised>
        <Header as="h4" color="red">
          <Icon name="exclamation triangle" />
          {featureName ? `${featureName} Error` : 'Something went wrong'}
        </Header>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          This section encountered an error. You can try again or continue using
          other parts of the application.
        </p>
        <Button primary size="small" onClick={this.handleRetry}>
          <Icon name="redo" />
          Try Again
        </Button>
      </ErrorCard>
    );
  }

  renderMinimalError() {
    return (
      <MinimalError>
        <Icon name="exclamation circle" />
        Something went wrong.{' '}
        <Button
          basic
          size="mini"
          color="red"
          onClick={this.handleRetry}
          style={{ marginLeft: '0.5rem' }}
        >
          Retry
        </Button>
      </MinimalError>
    );
  }

  render() {
    const { hasError } = this.state;
    const { children, variant, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback({ error: this.state.error, retry: this.handleRetry })
          : fallback;
      }

      // Render based on variant
      switch (variant) {
        case 'inline':
          return this.renderInlineError();
        case 'minimal':
          return this.renderMinimalError();
        case 'full':
        default:
          return this.renderFullError();
      }
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['full', 'inline', 'minimal']),
  featureName: PropTypes.string,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
};

ErrorBoundary.defaultProps = {
  variant: 'full',
  featureName: null,
  fallback: null,
  onError: null,
};

export default ErrorBoundary;
