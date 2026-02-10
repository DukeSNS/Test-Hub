import React from 'react';
import { User, Bell, Database, Info, Sun, Moon, Palette, Eye, EyeOff, BookOpen } from 'lucide-react';

const themes = [
    {
        id: 'light',
        name: 'Light',
        description: 'Clean and bright interface',
        swatch: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        icon: <Sun size={18} />
    },
    {
        id: 'dark',
        name: 'Dark',
        description: 'Easy on the eyes for night use',
        swatch: 'linear-gradient(135deg, #1e293b, #0f172a)',
        icon: <Moon size={18} />
    },
    {
        id: 'japandi',
        name: 'Japandi',
        description: 'Serene organic tones in cream and tan',
        swatch: 'linear-gradient(135deg, #F5F0E8, #D4C4AD)',
        icon: <Palette size={18} />
    }
];

const ToggleSwitch = ({ checked, onChange }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: checked ? 'var(--color-primary)' : '#cbd5e1',
            borderRadius: '24px', transition: '0.3s'
        }}>
            <span style={{
                position: 'absolute', height: '18px', width: '18px',
                left: checked ? '23px' : '3px', bottom: '3px',
                backgroundColor: 'white', borderRadius: '50%', transition: '0.3s'
            }} />
        </span>
    </label>
);

const Settings = ({ theme, setTheme, showDescriptions, setShowDescriptions, showQuickStart, setShowQuickStart }) => {
    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Settings</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your application preferences and configurations.</p>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
                {/* Theme Selector */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Palette size={24} style={{ color: 'var(--color-primary)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Appearance</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Choose a theme that suits your workflow.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {themes.map(t => (
                            <div
                                key={t.id}
                                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                                onClick={() => setTheme(t.id)}
                            >
                                <div className="theme-swatch" style={{ background: t.swatch }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {t.icon}
                                        {t.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                        {t.description}
                                    </div>
                                </div>
                                {theme === t.id && (
                                    <div style={{
                                        width: '22px', height: '22px', borderRadius: '50%',
                                        backgroundColor: 'var(--color-primary)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                                    }}>✓</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Preferences */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        {showDescriptions ? <Eye size={24} style={{ color: 'var(--color-primary)' }} /> : <EyeOff size={24} style={{ color: 'var(--color-primary)' }} />}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Display Preferences</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Control which interface elements are visible.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-bg-app)', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontWeight: '500', marginBottom: '2px' }}>Page Descriptions</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    Show subtitle descriptions below page headings
                                </div>
                            </div>
                            <ToggleSwitch checked={showDescriptions} onChange={() => setShowDescriptions(!showDescriptions)} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-bg-app)', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontWeight: '500', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <BookOpen size={16} />
                                    Quick Start Guide
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    Show the Quick Start Guide on the Dashboard
                                </div>
                            </div>
                            <ToggleSwitch checked={showQuickStart} onChange={() => setShowQuickStart(!showQuickStart)} />
                        </div>
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
