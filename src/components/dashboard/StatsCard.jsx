import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</p>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: '700', marginTop: '4px' }}>{value}</h3>
                </div>
                <div style={{
                    backgroundColor: color || 'var(--color-primary-light)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {Icon && <Icon size={24} color={color ? 'white' : 'var(--color-primary)'} />}
                </div>
            </div>

            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                    <span style={{
                        color: trend > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                        fontWeight: '600',
                        backgroundColor: trend > 0 ? '#d1fae5' : '#ffe4e6',
                        padding: '2px 6px',
                        borderRadius: '4px'
                    }}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span style={{ color: 'var(--color-text-nav)' }}>from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
