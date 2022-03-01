import React from 'react';
import MainLayout from '../../common/components/MainLayout';
import LegacyDashboard from '../legacy/Dashboard';

const DashboardPage = props => {
  return (
    <MainLayout>
      <LegacyDashboard {...props} />
    </MainLayout>
  );
};

export default DashboardPage;
