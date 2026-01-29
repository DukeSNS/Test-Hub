import React from 'react';
import { User, Bell, Shield, Database, Info, Moon, Sun } from 'lucide-react';

const Settings = ({ darkMode, toggleDarkMode }) => {
    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Settings</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your application preferences and configurations.</p>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        {darkMode ? <Moon size={24} style={{ color: 'var(--color-primary)' }} /> : <Sun size={24} style={{ color: 'var(--color-primary)' }} />}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Appearance</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Customize the look and feel of the application.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-bg-app)', borderRadius: '8px' }}>
                        <div>
                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>Dark Mode</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                            </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: darkMode ? 'var(--color-primary)' : '#cbd5e1',
                                borderRadius: '28px',
                                transition: '0.3s',
                                cursor: 'pointer'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '20px',
                                    width: '20px',
                                    left: darkMode ? '28px' : '4px',
                                    bottom: '4px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    transition: '0.3s'
                                }}></span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <User size={24} style={{ color: 'var(--color-primary)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>User Profile</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Manage your personal information and account details.
                    </p>
                    <button className="btn btn-secondary">Edit Profile</button>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Bell size={24} style={{ color: 'var(--color-primary)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Notifications</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Configure how you receive updates and alerts.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" defaultChecked />
                            <span>Email notifications for new bugs</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" defaultChecked />
                            <span>Test case completion alerts</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" />
                            <span>Weekly summary reports</span>
                        </label>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Database size={24} style={{ color: 'var(--color-primary)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Data Management</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Export, import, or clear your testing data.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary">Clear All Data</button>
                        <button className="btn btn-secondary">Reset to Defaults</button>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Info size={24} style={{ color: 'var(--color-primary)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>About TestHub</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                        Version: 1.0.0
                    </p>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        A comprehensive QA management system for tracking test scenarios, cases, and bugs.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
