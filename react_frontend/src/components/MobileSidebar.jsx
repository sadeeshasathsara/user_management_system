import React from 'react';

const MobileSidebar = ({ sidebarOpen, setSidebarOpen, children }) => {
    return (
        <>
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {children}
        </>
    );
};

export default MobileSidebar;