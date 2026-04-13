import React from 'react';
import { Shell } from './components/layout/Shell';
import { HomeView } from './components/views/HomeView';
import { FlowDesigner } from './components/views/FlowDesigner';
import { TaskCenter } from './components/views/TaskCenter';
import { EmployeeList } from './components/views/EmployeeList';
import { IntegrationHub } from './components/views/IntegrationHub';
import { AdminConsole } from './components/views/AdminConsole';
import { LoginPage } from './components/views/LoginPage';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';

const AppContent: React.FC = () => {
  const { activeView, isAuthenticated, isApiMode } = useWorkflow();

  // Show login page only in API mode when not authenticated
  if (isApiMode && !isAuthenticated) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':         return <HomeView />;
      case 'visualizer':   return <FlowDesigner />;
      case 'tasks':        return <TaskCenter />;
      case 'employees':    return <EmployeeList />;
      case 'integrations': return <IntegrationHub />;
      case 'admin':        return <AdminConsole />;
      default:             return <HomeView />;
    }
  };

  return <Shell>{renderView()}</Shell>;
};

const App: React.FC = () => (
  <WorkflowProvider>
    <AppContent />
  </WorkflowProvider>
);

export default App;
