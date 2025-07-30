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
      <style jsx>{`
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
          <DashboardWrapper>
            <DashboardHome currentPath="dashboard" />
          </DashboardWrapper>
        } />

        <Route path="/dashboard" element={
          <DashboardWrapper>
            <DashboardHome currentPath="dashboard" />
          </DashboardWrapper>
        } />

        {/* Employee Routes */}
        <Route path="/employees" element={
          <DashboardWrapper>
            <EmployeesList currentPath="employees" />
          </DashboardWrapper>
        } />

        <Route path="/employees/add" element={
          <DashboardWrapper>
            <AddEmployee currentPath="employees/add" />
          </DashboardWrapper>
        } />

        <Route path="/employees/edit/:id" element={
          <DashboardWrapper>
            <ViewEditEmployee currentPath="employees/edit" />
          </DashboardWrapper>
        } />

        <Route path="/employees/:id" element={
          <DashboardWrapper>
            <ViewEditEmployee currentPath="employees/id" />
          </DashboardWrapper>
        } />

        {/* Department Routes */}
        <Route path="/departments" element={
          <DashboardWrapper>
            <DepartmentsList currentPath="departments" />
          </DashboardWrapper>
        } />

        <Route path="/departments/add" element={
          <DashboardWrapper>
            <AddDepartment currentPath="departments/add" />
          </DashboardWrapper>
        } />

        <Route path="/departments/edit/:id" element={
          <DashboardWrapper>
            <EditDepartment currentPath="departments/edit" />
          </DashboardWrapper>
        } />

        <Route path="/departments/:id" element={
          <DashboardWrapper>
            <EditDepartment currentPath="departments/id" />
          </DashboardWrapper>
        } />

        {/* EPF Routes */}
        <Route path="/epf" element={
          <DashboardWrapper>
            <EPFList currentPath="epf" />
          </DashboardWrapper>
        } />

        <Route path="/epf/add" element={
          <DashboardWrapper>
            <AddEPF currentPath="epf/add" />
          </DashboardWrapper>
        } />

        {/* Admin Routes */}
        <Route path="/admins" element={
          <DashboardWrapper>
            <AdminsList currentPath="admins" />
          </DashboardWrapper>
        } />

        <Route path="/admins/add" element={
          <DashboardWrapper>
            <AddAdmin currentPath="admins/add" />
          </DashboardWrapper>
        } />

        {/* Settings Routes */}
        <Route path="/settings/epf" element={
          <DashboardWrapper>
            <EPFSettings currentPath="settings/epf" />
          </DashboardWrapper>
        } />

        {/* Reports Route */}
        <Route path="/reports" element={
          <DashboardWrapper>
            <Reports currentPath="reports" />
          </DashboardWrapper>
        } />

        {/* Catch-all route - redirect to dashboard */}
        <Route path="*" element={
          <DashboardWrapper>
            <DashboardHome currentPath="dashboard" />
          </DashboardWrapper>
        } />
      </Routes>
    </div>
  );
}

export default App;