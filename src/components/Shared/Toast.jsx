import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: bgColor,
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            minWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <Icon size={20} />
            <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500' }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
