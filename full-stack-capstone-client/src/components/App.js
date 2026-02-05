import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { createGlobalStyle } from 'styled-components';

// Shared components (static - always needed)
import {
  Header,
  Footer,
  ErrorBoundary,
  SessionManagerWrapper,
  Landing,
  RouteLoader,
} from '../shared';

// Auth HOC (static - needed for protected routes)
import { authRequired } from '../features/auth';

// Helper for lazy loading named exports from barrel files
const lazyNamed = (importFn, exportName) =>
  lazy(() => importFn().then(module => ({ default: module[exportName] })));

// Lazy-loaded feature components (code splitting)
const Register = lazyNamed(() => import('../features/auth'), 'Register');
const Signin = lazyNamed(() => import('../features/auth'), 'Signin');
const Signout = lazyNamed(() => import('../features/auth'), 'Signout');

const Students = lazyNamed(() => import('../features/students'), 'StudentList');
const CreateStudent = lazyNamed(
  () => import('../features/students'),
  'CreateStudent'
);
const UpdateStudent = lazyNamed(
  () => import('../features/students'),
  'UpdateStudent'
);

const Dashboard = lazyNamed(() => import('../features/dashboard'), 'Dashboard');
const ModalManager = lazyNamed(
  () => import('../features/modals'),
  'ModalManager'
);
const ChatBubble = lazyNamed(() => import('../features/ai'), 'ChatBubble');

// Create protected components
const ProtectedStudents = authRequired(Students);
const ProtectedDashboard = authRequired(Dashboard);
const ProtectedCreateStudent = authRequired(CreateStudent);
const ProtectedUpdateStudent = authRequired(UpdateStudent);

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 14px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  i {
    color: #2873b4;
    transition: color 0.2s ease;

    :hover{
      cursor: pointer;
      color: red;
    }
  }

  body {
    margin: auto;
    font-size: 1.5rem;
    line-height: 2;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    width: 100%;
    font-display: swap; /* Improve font loading performance */
    min-height: 100vh;
    padding-bottom: 50px; /* Space for fixed footer */
  }

  /* Font loading optimization */
  .fonts-loaded body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .fonts-failed body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Improve rendering performance */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Container>
        <ErrorBoundary featureName="Application">
          <Header />
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route
                path="/signup"
                element={
                  <ErrorBoundary variant="inline" featureName="Registration">
                    <Register />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/signin"
                element={
                  <ErrorBoundary variant="inline" featureName="Sign In">
                    <Signin />
                  </ErrorBoundary>
                }
              />

              {/* Protected routes with feature-level error boundaries */}
              <Route
                path="/students/:id/update"
                element={
                  <ErrorBoundary variant="inline" featureName="Update Student">
                    <ProtectedUpdateStudent />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/students"
                element={
                  <ErrorBoundary variant="inline" featureName="Student List">
                    <ProtectedStudents />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/dashboard/*"
                element={
                  <ErrorBoundary variant="inline" featureName="Dashboard">
                    <ProtectedDashboard />
                  </ErrorBoundary>
                }
              />
              <Route path="/signout" element={<Signout />} />
              <Route
                path="/students/new"
                element={
                  <ErrorBoundary variant="inline" featureName="Create Student">
                    <ProtectedCreateStudent />
                  </ErrorBoundary>
                }
              />
            </Routes>
            <ModalManager />
          </Suspense>
          <SessionManagerWrapper />
          <Footer />
        </ErrorBoundary>
      </Container>
      <Suspense fallback={null}>
        <ErrorBoundary variant="minimal" featureName="AI Chat">
          <ChatBubble />
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
