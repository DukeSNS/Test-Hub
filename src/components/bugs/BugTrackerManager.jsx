import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Paperclip, Edit2 } from 'lucide-react';
import Modal from '../Shared/Modal';
import ImageViewer from '../Shared/ImageViewer';

const BugTrackerManager = () => {
    const { bugs, addBug, updateBug, deleteBug } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [viewingImage, setViewingImage] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        bugId: '',
        summary: '',
        module: '',
        steps: '',
        expectedResult: '',
        actualResult: '',
        severity: 'Medium',
        priority: 'P2',
        status: 'Open',
        screenshot: null
    });

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    screenshot: reader.result,
                    screenshotName: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const openCreateModal = () => {
        setFormData({
            bugId: '',
            summary: '',
            module: '',
            steps: '',
            expectedResult: '',
            actualResult: '',
            severity: 'Medium',
            priority: 'P2',
            status: 'Open',
            screenshot: null
        });
        setIsEditMode(false);
        setIsModalOpen(true);
        setError('');
    };

    const openEditModal = (bug) => {
        setFormData(bug);
        setIsEditMode(true);
        setIsModalOpen(true);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                updateBug(formData);
            } else {
                addBug(formData);
            }
            setIsModalOpen(false);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return '#be185d'; // Pink 700
            case 'High': return '#e11d48'; // Rose 600
            case 'Medium': return '#f59e0b'; // Amber 500
            case 'Low': return '#10b981'; // Emerald 500
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Bug Tracker</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Track and manage software defects.</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={20} />
                    Report Bug
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>ID</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Summary</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Severity</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Priority</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Screenshot</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bugs.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No bugs reported. Excellent work!
                                </td>
                            </tr>
                        ) : (
                            bugs.map((bug, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{bug.bugId}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500' }}>{bug.summary}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{bug.module}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ color: getSeverityColor(bug.severity), fontWeight: '600' }}>{bug.severity}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>{bug.priority}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: '#f1f5f9',
                                            fontSize: '0.75rem',
                                            color: '#0f172a',
                                            fontWeight: '500'
                                        }}>
                                            {bug.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {bug.screenshot && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setViewingImage({ url: bug.screenshot, name: bug.screenshotName || 'Screenshot' });
                                                }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'underline' }}
                                            >
                                                <Paperclip size={14} />
                                                {bug.screenshotName || 'View Screenshot'}
                                            </a>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openEditModal(bug)}
                                            style={{ color: 'var(--color-primary)', padding: '4px' }}
                                            title="Edit Bug"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteBug(bug.bugId)}
                                            style={{ color: 'var(--color-danger)', padding: '4px' }}
                                            title="Delete Bug"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Bug" : "Report New Bug"}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Bug ID</label>
                            <input
                                required
                                disabled={isEditMode}
                                type="text"
                                placeholder="BUG-001"
                                value={formData.bugId}
                                onChange={(e) => setFormData({ ...formData, bugId: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: isEditMode ? '#f1f5f9' : 'white',
                                    cursor: isEditMode ? 'not-allowed' : 'text'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Module</label>
                            <input
                                required
                                type="text"
                                placeholder="Checkout"
                                value={formData.module}
                                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Summary</label>
                        <input
                            required
                            type="text"
                            placeholder="App crashes when clicking Submit"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Steps to Reproduce</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.steps}
                            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Expected Result</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.expectedResult}
                                onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Actual Result</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.actualResult}
                                onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Severity</label>
                            <select
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}
                            >
                                <option>P1</option>
                                <option>P2</option>
                                <option>P3</option>
                                <option>P4</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}
                            >
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Fixed</option>
                                <option>Closed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Screenshot</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '0.875rem' }} />
                        {formData.screenshotName && <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Current: {formData.screenshotName}</p>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Report Bug'}</button>
                    </div>
                </form>
            </Modal>
            {viewingImage && (
                <ImageViewer
                    imageUrl={viewingImage.url}
                    imageName={viewingImage.name}
                    onClose={() => setViewingImage(null)}
                />
            )}
        </div>
    );
};

export default BugTrackerManager;
