import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeView, setActiveView }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-app)' }}>
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <main style={{
                marginLeft: isSidebarCollapsed ? '80px' : '260px',
                width: isSidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 260px)',
                padding: '32px 48px',
                transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
