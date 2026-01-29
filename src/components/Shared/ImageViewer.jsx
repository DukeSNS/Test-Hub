import React from 'react';
import { X } from 'lucide-react';

const ImageViewer = ({ imageUrl, imageName, onClose }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '40px'
            }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    color: '#0f172a'
                }}
            >
                <X size={24} />
            </button>
            <div
                style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: 0
                    }}>
                        {imageName || 'Screenshot'}
                    </h3>
                </div>
                <div style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={imageUrl}
                        alt={imageName || 'Screenshot'}
                        style={{
                            maxWidth: '100%',
                            maxHeight: 'calc(90vh - 160px)',
                            objectFit: 'contain',
                            display: 'block',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;
