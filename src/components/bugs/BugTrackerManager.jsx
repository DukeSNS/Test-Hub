import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Paperclip, Search } from 'lucide-react';
import Modal from '../Shared/Modal';
import ImageViewer from '../Shared/ImageViewer';
import ContextMenu from '../Shared/ContextMenu';
import ConfirmDialog from '../Shared/ConfirmDialog';
import ViewDetailModal from '../Shared/ViewDetailModal';

const truncateId = (id, max = 10) => id && id.length > max ? id.substring(0, max) + '…' : id;

const BugTrackerManager = ({ showDescriptions }) => {
    const { bugs, addBug, updateBug, deleteBug, reorderBug } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [viewingImage, setViewingImage] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        bugId: '', summary: '', module: '', steps: '',
        expectedResult: '', actualResult: '',
        severity: 'Medium', priority: 'P2', status: 'Open', screenshot: null
    });
    const [contextMenu, setContextMenu] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [viewDetail, setViewDetail] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBugs = useMemo(() => {
        if (!searchQuery.trim()) return bugs;
        const q = searchQuery.toLowerCase();
        return bugs.filter(b =>
            b.bugId.toLowerCase().includes(q) ||
            b.summary.toLowerCase().includes(q) ||
            (b.module || '').toLowerCase().includes(q) ||
            (b.severity || '').toLowerCase().includes(q) ||
            (b.priority || '').toLowerCase().includes(q) ||
            (b.status || '').toLowerCase().includes(q)
        );
    }, [bugs, searchQuery]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, screenshot: reader.result, screenshotName: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const openCreateModal = () => {
        setFormData({
            bugId: '', summary: '', module: '', steps: '',
            expectedResult: '', actualResult: '',
            severity: 'Medium', priority: 'P2', status: 'Open', screenshot: null
        });
        setIsEditMode(false); setIsModalOpen(true); setError('');
    };

    const openEditModal = (bug) => {
        setFormData(bug); setIsEditMode(true); setIsModalOpen(true); setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isEditMode) { updateBug(formData); }
            else { addBug(formData); }
            setIsModalOpen(false); setError('');
        } catch (err) { setError(err.message); }
    };

    const handleContextMenu = (e, bug, index) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, item: bug, index });
    };

    const handleDelete = (bug) => {
        setConfirmDialog({
            title: 'Delete Bug?',
            message: `Are you sure you want to delete bug "${bug.bugId}"? This action cannot be undone.`,
            onConfirm: () => deleteBug(bug.bugId)
        });
    };

    const getContextMenuItems = (bug, index) => [
        { label: 'View Details', icon: 'view', onClick: () => setViewDetail(bug) },
        { label: 'Edit', icon: 'edit', onClick: () => openEditModal(bug) },
        { separator: true },
        { label: 'Move Up', icon: 'moveUp', onClick: () => reorderBug(bug.bugId, 'up'), disabled: index === 0 },
        { label: 'Move Down', icon: 'moveDown', onClick: () => reorderBug(bug.bugId, 'down'), disabled: index === bugs.length - 1 },
        { separator: true },
        { label: 'Delete', icon: 'delete', danger: true, onClick: () => handleDelete(bug) }
    ];

    const getViewFields = (bug) => [
        { label: 'Bug ID', value: bug.bugId },
        { label: 'Summary', value: bug.summary },
        { label: 'Module', value: bug.module },
        { label: 'Steps to Reproduce', value: bug.steps },
        { label: 'Expected Result', value: bug.expectedResult },
        { label: 'Actual Result', value: bug.actualResult },
        { label: 'Severity', value: bug.severity },
        { label: 'Priority', value: bug.priority },
        { label: 'Status', value: bug.status }
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return '#be185d';
            case 'High': return '#e11d48';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Bug Tracker</h2>
                    {showDescriptions && (
                        <p style={{ color: 'var(--color-text-muted)' }}>Track and manage software defects. Right-click a row for options.</p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                    <div className="search-bar" style={{ maxWidth: '240px' }}>
                        <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                        <input type="text" placeholder="Search bugs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={openCreateModal} style={{ whiteSpace: 'nowrap' }}>
                        <Plus size={20} />
                        Report Bug
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '120px' }}>ID</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Summary</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '90px' }}>Severity</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '80px' }}>Priority</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '100px' }}>Status</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '130px' }}>Screenshot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBugs.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    {searchQuery ? 'No bugs match your search.' : 'No bugs reported. Excellent work!'}
                                </td>
                            </tr>
                        ) : (
                            filteredBugs.map((bug, index) => (
                                <tr key={bug.bugId}
                                    style={{ borderBottom: '1px solid var(--color-border)', cursor: 'context-menu' }}
                                    className={contextMenu?.item?.bugId === bug.bugId ? 'context-active' : ''}
                                    onContextMenu={(e) => handleContextMenu(e, bug, index)}
                                    onDoubleClick={() => setViewDetail(bug)}
                                >
                                    <td style={{ padding: '16px', fontWeight: '500', whiteSpace: 'nowrap' }} title={bug.bugId}>{truncateId(bug.bugId)}</td>
                                    <td className="truncate-cell" style={{ padding: '16px' }} title={`${bug.summary}\n${bug.module}`}>
                                        <div style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bug.summary}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bug.module}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ color: getSeverityColor(bug.severity), fontWeight: '600' }}>{bug.severity}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>{bug.priority}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '12px',
                                            backgroundColor: 'var(--color-status-bg)', fontSize: '0.75rem',
                                            color: 'var(--color-status-text)', fontWeight: '500'
                                        }}>{bug.status}</span>
                                    </td>
                                    <td className="truncate-cell" style={{ padding: '16px' }}>
                                        {bug.screenshot && (
                                            <a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                setViewingImage({ url: bug.screenshot, name: bug.screenshotName || 'Screenshot' });
                                            }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <Paperclip size={14} style={{ flexShrink: 0 }} />
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bug.screenshotName || 'View Screenshot'}</span>
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {contextMenu && (
                <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)}
                    items={getContextMenuItems(contextMenu.item, contextMenu.index)} />
            )}
            <ConfirmDialog isOpen={!!confirmDialog} onClose={() => setConfirmDialog(null)}
                onConfirm={confirmDialog?.onConfirm || (() => { })} title={confirmDialog?.title || ''}
                message={confirmDialog?.message || ''} />
            <ViewDetailModal isOpen={!!viewDetail} onClose={() => setViewDetail(null)}
                onEdit={() => viewDetail && openEditModal(viewDetail)} title="Bug Details"
                fields={viewDetail ? getViewFields(viewDetail) : []} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Bug" : "Report New Bug"}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Bug ID</label>
                            <input required disabled={isEditMode} type="text" placeholder="BUG-001"
                                value={formData.bugId} onChange={(e) => setFormData({ ...formData, bugId: e.target.value })}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)',
                                    backgroundColor: isEditMode ? 'var(--color-bg-app)' : undefined, cursor: isEditMode ? 'not-allowed' : 'text'
                                }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Module</label>
                            <input required type="text" placeholder="Checkout"
                                value={formData.module} onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Summary</label>
                        <input required type="text" placeholder="App crashes when clicking Submit"
                            value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Steps to Reproduce</label>
                        <textarea required rows="4" value={formData.steps}
                            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Expected Result</label>
                            <textarea required rows="3" value={formData.expectedResult}
                                onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Actual Result</label>
                            <textarea required rows="3" value={formData.actualResult}
                                onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Severity</label>
                            <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Priority</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                <option>P1</option><option>P2</option><option>P3</option><option>P4</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Status</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                <option>Open</option><option>In Progress</option><option>Fixed</option><option>Closed</option>
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
                <ImageViewer imageUrl={viewingImage.url} imageName={viewingImage.name} onClose={() => setViewingImage(null)} />
            )}
        </div>
    );
};

export default BugTrackerManager;
