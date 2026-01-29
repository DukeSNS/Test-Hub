import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, CheckSquare, Bug, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onCollapseChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (onCollapseChange) {
            onCollapseChange(isCollapsed);
        }
    }, [isCollapsed, onCollapseChange]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard' },
        { icon: FileText, label: 'Scenarios' },
        { icon: CheckSquare, label: 'Test Cases' },
        { icon: Bug, label: 'Bug Tracker' },
    ];

    return (
        <aside style={{
            width: isCollapsed ? '80px' : '260px',
            height: '100vh',
            backgroundColor: 'var(--color-bg-sidebar)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            transition: 'width 0.3s ease'
        }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                {!isCollapsed && (
                    <>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                            TestHub
                        </h1>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-nav)', marginTop: '4px' }}>QA Management System</p>
                    </>
                )}
                {isCollapsed && (
                    <div style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto' }}></div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        position: 'absolute',
                        right: '-12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav style={{ flex: 1, padding: '24px 16px' }}>
                {!isCollapsed && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-nav)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600', letterSpacing: '0.05em' }}>
                        Main Menu
                    </p>
                )}
                <ul style={{ listStyle: 'none' }}>
                    {menuItems.map((item, index) => {
                        const isActive = activeView === item.label;
                        return (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setActiveView(item.label); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        color: isActive ? 'white' : 'var(--color-text-nav)',
                                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        fontWeight: isActive ? '500' : 'normal',
                                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                                    }}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <item.icon size={20} />
                                    {!isCollapsed && item.label}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveView('Settings'); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: activeView === 'Settings' ? 'white' : 'var(--color-text-nav)',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: activeView === 'Settings' ? 'var(--color-primary)' : 'transparent',
                        cursor: 'pointer',
                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                    }}
                    title={isCollapsed ? 'Settings' : ''}
                >
                    <Settings size={20} />
                    {!isCollapsed && 'Settings'}
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
