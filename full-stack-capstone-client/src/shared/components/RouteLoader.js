import React from 'react';
import { Segment, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

const LoaderContainer = styled(Segment)`
  &&& {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: none;
  }
`;

/**
 * Lightweight loading indicator for lazy-loaded routes.
 * Less intrusive than full-screen LoadingSpinner - shows inline loader.
 */
const RouteLoader = () => (
  <LoaderContainer basic>
    <Loader active inline="centered" size="large">
      Loading...
    </Loader>
  </LoaderContainer>
);

export default RouteLoader;
