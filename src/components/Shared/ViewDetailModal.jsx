import React from 'react';
import { X, Edit2 } from 'lucide-react';

const DetailField = ({ label, value }) => {
    if (!value) return null;
    const isLong = value.length > 80 || value.includes('\n');
    return (
        <div className="detail-field">
            <div className="detail-label">{label}</div>
            <div className={isLong ? 'detail-value' : 'detail-value-short'}>
                {value}
            </div>
        </div>
    );
};

const ViewDetailModal = ({ isOpen, onClose, onEdit, title, fields }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '640px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexShrink: 0
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => { onEdit(); onClose(); }}
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                            <Edit2 size={14} />
                            Edit
                        </button>
                        <button onClick={onClose} style={{ color: 'var(--color-text-muted)', padding: '4px' }}>
                            <X size={22} />
                        </button>
                    </div>
                </div>
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                    {fields.map((field, index) => (
                        <DetailField key={index} label={field.label} value={field.value} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewDetailModal;
