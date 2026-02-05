import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';

import Navigation from './Navigation';
import DashboardHome from './DashboardHome';
import SideBar from './Sidebar';
import { authRequired } from '../../auth';
import { StudentList as Students } from '../../students';
import { SEO } from '../../../shared';
import { selectIsSidebarToggled } from '../toggleSlice';

const StyledGrid = styled(Grid)`
  &&& div .ui.centered.grid {
    margin: auto;
  }
  min-height: calc(100vh - 60px); /* Account for footer height */
  padding-bottom: 60px; /* Prevent content from being hidden behind footer */
`;

const Dashboard = () => {
  const isToggled = useSelector(selectIsSidebarToggled);

  return (
    <>
      <SEO
        title="Dashboard - educationELLy"
        description="Access your educationELLy dashboard to manage English Language Learning students, track progress, and organize your teaching workflows."
        keywords="ELL dashboard, student management, teacher dashboard, language learning tracking"
        canonicalUrl="/dashboard"
        noIndex={true}
      />
      <StyledGrid
        centered
        style={{ height: '100%' }}
        verticalAlign="middle"
        className={isToggled ? 'toggled' : ''}
        data-testid="dashboard-grid"
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/students" element={<Students />} />
        </Routes>
        <SideBar />
      </StyledGrid>
    </>
  );
};

export default authRequired(Dashboard);
