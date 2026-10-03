import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { ChangePasswordModal } from './components/ChangePasswordModal';

// Views
import { DashboardView } from './pages/DashboardView';
import { ProjectsView } from './pages/ProjectsView';
import { ProcessTrackerView } from './pages/ProcessTrackerView';
import { RequirementsView } from './pages/RequirementsView';
import { StakeholdersView } from './pages/StakeholdersView';
import { TasksView } from './pages/TasksView';
import { UserStoriesView } from './pages/UserStoriesView';
import { BusinessRulesView } from './pages/BusinessRulesView';
import { ChangeRequestsView } from './pages/ChangeRequestsView';
import { AnalyticsView } from './pages/AnalyticsView';
import { TimelineView } from './pages/TimelineView';
import { SettingsView } from './pages/SettingsView';
import { AdminDashboard } from './pages/AdminDashboard';

export const App = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeRoleView, setActiveRoleView] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F2] flex flex-col items-center justify-center gap-3 text-[#064E45] font-mono text-xs">
        <div className="w-10 h-10 border-3 border-[#064E45] border-t-transparent rounded-full animate-spin" />
        <span className="font-bold tracking-wider">LOADING BA PROCESS TRACKER...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#10201D] flex flex-col">
      {/* SaaS Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenPasswordModal={() => setShowPasswordModal(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <TopNavbar
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenPasswordModal={() => setShowPasswordModal(true)}
          activeRoleView={activeRoleView}
          setActiveRoleView={setActiveRoleView}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {activeRoleView === 'ADMIN' ? (
            <AdminDashboard />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenNewRequirementModal={() => setActiveTab('requirements')}
                />
              )}
              {activeTab === 'projects' && (
                <ProjectsView
                  onSelectProject={() => setActiveTab('dashboard')}
                  onOpenCreateProjectModal={() => setActiveRoleView('ADMIN')}
                />
              )}
              {activeTab === 'process-tracker' && <ProcessTrackerView />}
              {activeTab === 'requirements' && <RequirementsView />}
              {activeTab === 'stakeholders' && <StakeholdersView />}
              {activeTab === 'tasks' && <TasksView />}
              {activeTab === 'user-stories' && <UserStoriesView />}
              {activeTab === 'business-rules' && <BusinessRulesView />}
              {activeTab === 'change-requests' && <ChangeRequestsView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'timeline' && <TimelineView />}
              {activeTab === 'settings' && (
                <SettingsView onOpenPasswordModal={() => setShowPasswordModal(true)} />
              )}
            </>
          )}
        </main>

        {/* Clean Footer */}
        <footer className="border-t border-[#E3E8DE] bg-[#FFFFFF] py-4 px-6 text-center text-xs text-[#5A6E69] font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-bold text-[#064E45]">
              BA Process Tracker • Enterprise Delivery Cockpit
            </span>
            <span>Designed for Business Analysts & Client Stakeholders</span>
          </div>
        </footer>
      </div>

      {/* Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default App;
