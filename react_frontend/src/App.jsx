import React, { useState, useEffect } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to get current page from URL
  const getCurrentPageFromURL = () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/dashboard') {
      return 'dashboard';
    }
    return path.substring(1);
  };

  // Function to update URL without page reload
  const updateURL = (page) => {
    const url = page === 'dashboard' ? '/dashboard' : `/${page}`;
    window.history.pushState({ page }, '', url);
  };

  // Custom setCurrentPage that also updates URL
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(page);
  };

  // Make handlePageChange available globally for breadcrumb navigation
  useEffect(() => {
    window.setCurrentPage = handlePageChange;
    return () => {
      delete window.setCurrentPage;
    };
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const page = event.state?.page || getCurrentPageFromURL();
      setCurrentPage(page);
    };

    const initialPage = getCurrentPageFromURL();
    setCurrentPage(initialPage);

    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ page: initialPage }, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderPage = () => {
    // Pass currentPage as prop to each component
    const pageProps = { currentPath: currentPage };

    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome {...pageProps} />;
      case 'employees':
        return <EmployeesList {...pageProps} />;
      case 'employees/add':
        return <AddEmployee {...pageProps} />;
      case 'employees/edit':
      case 'employees/id':
        return <ViewEditEmployee {...pageProps} />;
      case 'departments':
        return <DepartmentsList {...pageProps} />;
      case 'departments/add':
        return <AddDepartment {...pageProps} />;
      case 'departments/edit':
      case 'departments/id':
        return <EditDepartment {...pageProps} />;
      case 'epf':
        return <EPFList {...pageProps} />;
      case 'epf/add':
        return <AddEPF {...pageProps} />;
      case 'admins':
        return <AdminsList {...pageProps} />;
      case 'admins/add':
        return <AddAdmin {...pageProps} />;
      case 'settings/epf':
        return <EPFSettings {...pageProps} />;
      case 'reports':
        return <Reports {...pageProps} />;
      default:
        return <DashboardHome {...pageProps} />;
    }
  };

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
      <DashboardLayout
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        {renderPage()}
      </DashboardLayout>
    </div>
  );
}

export default App;