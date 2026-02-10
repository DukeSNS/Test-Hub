import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search } from 'lucide-react';
import Modal from '../Shared/Modal';
import ContextMenu from '../Shared/ContextMenu';
import ConfirmDialog from '../Shared/ConfirmDialog';
import ViewDetailModal from '../Shared/ViewDetailModal';

const truncateId = (id, max = 10) => id && id.length > max ? id.substring(0, max) + '…' : id;

const ScenarioManager = ({ showDescriptions }) => {
    const { scenarios, addScenario, deleteScenario, updateScenario, getLinkedTestCases, reorderScenario } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ scenarioId: '', title: '', module: '', description: '' });
    const [error, setError] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [viewDetail, setViewDetail] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredScenarios = useMemo(() => {
        if (!searchQuery.trim()) return scenarios;
        const q = searchQuery.toLowerCase();
        return scenarios.filter(s =>
            s.scenarioId.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            s.module.toLowerCase().includes(q) ||
            (s.description || '').toLowerCase().includes(q)
        );
    }, [scenarios, searchQuery]);

    const openCreateModal = () => {
        setFormData({ scenarioId: '', title: '', module: '', description: '' });
        setIsEditMode(false);
        setIsModalOpen(true);
        setError('');
    };

    const openEditModal = (scenario) => {
        setFormData(scenario);
        setIsEditMode(true);
        setIsModalOpen(true);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isEditMode) { updateScenario(formData); }
            else { addScenario(formData); }
            setIsModalOpen(false);
            setError('');
        } catch (err) { setError(err.message); }
    };

    const handleContextMenu = (e, scenario, index) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, scenario, index });
    };

    const handleDelete = (scenario) => {
        const linked = getLinkedTestCases(scenario.scenarioId);
        if (linked.length > 0) {
            setConfirmDialog({
                title: 'Delete Scenario?',
                message: `This scenario "${scenario.scenarioId}" has ${linked.length} linked test case${linked.length > 1 ? 's' : ''} (${linked.map(t => t.testCaseId).join(', ')}). Deleting it will orphan these test cases. Are you sure?`,
                onConfirm: () => deleteScenario(scenario.scenarioId)
            });
        } else {
            setConfirmDialog({
                title: 'Delete Scenario?',
                message: `Are you sure you want to delete scenario "${scenario.scenarioId}"? This action cannot be undone.`,
                onConfirm: () => deleteScenario(scenario.scenarioId)
            });
        }
    };

    const getContextMenuItems = (scenario, index) => [
        { label: 'View Details', icon: 'view', onClick: () => setViewDetail(scenario) },
        { label: 'Edit', icon: 'edit', onClick: () => openEditModal(scenario) },
        { separator: true },
        { label: 'Move Up', icon: 'moveUp', onClick: () => reorderScenario(scenario.scenarioId, 'up'), disabled: index === 0 },
        { label: 'Move Down', icon: 'moveDown', onClick: () => reorderScenario(scenario.scenarioId, 'down'), disabled: index === scenarios.length - 1 },
        { separator: true },
        { label: 'Delete', icon: 'delete', danger: true, onClick: () => handleDelete(scenario) }
    ];

    const getViewFields = (scenario) => [
        { label: 'Scenario ID', value: scenario.scenarioId },
        { label: 'Title', value: scenario.title },
        { label: 'Module', value: scenario.module },
        { label: 'Description', value: scenario.description }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Test Scenarios</h2>
                    {showDescriptions && (
                        <p style={{ color: 'var(--color-text-muted)' }}>Manage your high-level test scenarios. Right-click a row for options.</p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                    <div className="search-bar" style={{ maxWidth: '240px' }}>
                        <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                        <input type="text" placeholder="Search scenarios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={openCreateModal} style={{ whiteSpace: 'nowrap' }}>
                        <Plus size={20} />
                        New Scenario
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '120px' }}>ID</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '25%' }}>Title</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '130px' }}>Module</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredScenarios.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    {searchQuery ? 'No scenarios match your search.' : 'No scenarios found. Create one to get started.'}
                                </td>
                            </tr>
                        ) : (
                            filteredScenarios.map((scenario, index) => (
                                <tr
                                    key={scenario.scenarioId}
                                    style={{ borderBottom: '1px solid var(--color-border)', cursor: 'context-menu' }}
                                    className={contextMenu?.scenario?.scenarioId === scenario.scenarioId ? 'context-active' : ''}
                                    onContextMenu={(e) => handleContextMenu(e, scenario, index)}
                                    onDoubleClick={() => setViewDetail(scenario)}
                                >
                                    <td style={{ padding: '16px', fontWeight: '500', whiteSpace: 'nowrap' }} title={scenario.scenarioId}>{truncateId(scenario.scenarioId)}</td>
                                    <td className="truncate-cell" style={{ padding: '16px' }} title={scenario.title}>{scenario.title}</td>
                                    <td className="truncate-cell" style={{ padding: '16px' }} title={scenario.module}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px',
                                            backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-badge-text)',
                                            fontSize: '0.75rem', fontWeight: '500', display: 'inline-block',
                                            maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                        }}>{scenario.module}</span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>
                                        <div className="preserve-lines" title={scenario.description}>{scenario.description}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {contextMenu && (
                <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)}
                    items={getContextMenuItems(contextMenu.scenario, contextMenu.index)} />
            )}
            <ConfirmDialog isOpen={!!confirmDialog} onClose={() => setConfirmDialog(null)}
                onConfirm={confirmDialog?.onConfirm || (() => { })} title={confirmDialog?.title || ''}
                message={confirmDialog?.message || ''} confirmLabel="Delete" danger={true} />
            <ViewDetailModal isOpen={!!viewDetail} onClose={() => setViewDetail(null)}
                onEdit={() => viewDetail && openEditModal(viewDetail)} title="Scenario Details"
                fields={viewDetail ? getViewFields(viewDetail) : []} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Scenario" : "Create New Scenario"}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Scenario ID</label>
                        <input required disabled={isEditMode} type="text" placeholder="TS-001"
                            value={formData.scenarioId} onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)',
                                backgroundColor: isEditMode ? 'var(--color-bg-app)' : undefined, cursor: isEditMode ? 'not-allowed' : 'text'
                            }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Title</label>
                        <input required type="text" placeholder="User Login Flow"
                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Module</label>
                        <input required type="text" placeholder="Authentication"
                            value={formData.module} onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Description</label>
                        <textarea rows="3" value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Create Scenario'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ScenarioManager;
