import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/dashboard';
import EmployeesList from './pages/dashboard/employees';
import AddEmployee from './pages/dashboard/employees/add';
import ViewEditEmployee from './pages/dashboard/employees/id';
import DepartmentsList from './pages/dashboard/departments';
import AddDepartment from './pages/dashboard/departments/add';
import EditDepartment from './pages/dashboard/departments/id';
import EPFList from './pages/dashboard/epf';
import AddEPF from './pages/dashboard/epf/add';
import AdminsList from './pages/dashboard/admins';
import AddAdmin from './pages/dashboard/admins/add';
import EPFSettings from './pages/dashboard/settings/epf';
import Reports from './pages/dashboard/reports';
import Login from './pages/auth';
import ProtectRoutes from './components/ProtectRoutes';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from location pathname
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      return 'dashboard';
    }
    return path.substring(1);
  };

  const currentPage = getCurrentPage();

  // Custom navigation function for breadcrumb and sidebar
  const handlePageChange = (page) => {
    const url = page === 'dashboard' ? '/dashboard' : `/${page}`;
    navigate(url);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Make handlePageChange available globally for breadcrumb navigation
  useEffect(() => {
    window.setCurrentPage = handlePageChange;
    return () => {
      delete window.setCurrentPage;
    };
  }, [navigate]);

  // Dashboard Layout Wrapper Component
  const DashboardWrapper = ({ children }) => (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={handlePageChange}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="animate-fadeIn">
        {children}
      </div>
    </DashboardLayout>
  );

  return (
    <div className="App">
      <style jsx={'true'}>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes - All wrapped in DashboardLayout */}
        <Route path="/" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <DashboardHome currentPath="dashboard" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/dashboard" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <DashboardHome currentPath="dashboard" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* Employee Routes */}
        <Route path="/employees" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <EmployeesList currentPath="employees" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/employees/add" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <AddEmployee currentPath="employees/add" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/employees/edit/:id" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <ViewEditEmployee currentPath="employees/edit" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/employees/:id" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <ViewEditEmployee currentPath="employees/id" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* Department Routes */}
        <Route path="/departments" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <DepartmentsList currentPath="departments" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/departments/add" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <AddDepartment currentPath="departments/add" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/departments/edit/:id" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <EditDepartment currentPath="departments/edit" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/departments/:id" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <EditDepartment currentPath="departments/id" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* EPF Routes */}
        <Route path="/epf" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <EPFList currentPath="epf" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* EPF Routes */}
        <Route path="/epf" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <EPFList currentPath="epf" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/epf/add" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <AddEPF currentPath="epf/add" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/epf/add" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <AddEPF currentPath="epf/add" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* Admin Routes */}
        <Route path="/admins" element={
          <DashboardWrapper>
            <AdminsList currentPath="admins" />
          </DashboardWrapper>
        } />

        {/* Admin Routes */}
        <Route path="/admins" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <AdminsList currentPath="admins" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        <Route path="/admins/add" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <AddAdmin currentPath="admins/add" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* Settings Routes */}
        <Route path="/settings/epf" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <EPFSettings currentPath="settings/epf" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* Reports Route */}
        <Route path="/reports" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <Reports currentPath="reports" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />

        {/* Catch-all route - redirect to dashboard */}
        <Route path="*" element={
          <ProtectRoutes>
            <DashboardWrapper>
              <DashboardHome currentPath="dashboard" />
            </DashboardWrapper>
          </ProtectRoutes>
        } />
      </Routes>
    </div>
  );
}

export default App;