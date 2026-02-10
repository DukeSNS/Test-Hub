import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search } from 'lucide-react';
import Modal from '../Shared/Modal';
import ContextMenu from '../Shared/ContextMenu';
import ConfirmDialog from '../Shared/ConfirmDialog';
import ViewDetailModal from '../Shared/ViewDetailModal';

const truncateId = (id, max = 10) => id && id.length > max ? id.substring(0, max) + '…' : id;

const TestCaseManager = ({ showDescriptions }) => {
    const { testCases, scenarios, addTestCase, updateTestCase, deleteTestCase, reorderTestCase } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        testCaseId: '', scenarioId: '', steps: '', testData: '', expectedResult: '', actualResult: ''
    });
    const [contextMenu, setContextMenu] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [viewDetail, setViewDetail] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTestCases = useMemo(() => {
        if (!searchQuery.trim()) return testCases;
        const q = searchQuery.toLowerCase();
        return testCases.filter(tc =>
            tc.testCaseId.toLowerCase().includes(q) ||
            tc.scenarioId.toLowerCase().includes(q) ||
            tc.steps.toLowerCase().includes(q) ||
            (tc.expectedResult || '').toLowerCase().includes(q) ||
            (tc.actualResult || '').toLowerCase().includes(q) ||
            (tc.testData || '').toLowerCase().includes(q)
        );
    }, [testCases, searchQuery]);

    const openCreateModal = () => {
        setFormData({ testCaseId: '', scenarioId: '', steps: '', testData: '', expectedResult: '', actualResult: '' });
        setIsEditMode(false); setIsModalOpen(true); setError('');
    };

    const openEditModal = (testCase) => {
        setFormData(testCase); setIsEditMode(true); setIsModalOpen(true); setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isEditMode) { updateTestCase(formData); }
            else { addTestCase(formData); }
            setIsModalOpen(false); setError('');
        } catch (err) { setError(err.message); }
    };

    const handleContextMenu = (e, tc, index) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, item: tc, index });
    };

    const handleDelete = (tc) => {
        setConfirmDialog({
            title: 'Delete Test Case?',
            message: `Are you sure you want to delete test case "${tc.testCaseId}"? This action cannot be undone.`,
            onConfirm: () => deleteTestCase(tc.testCaseId)
        });
    };

    const getContextMenuItems = (tc, index) => [
        { label: 'View Details', icon: 'view', onClick: () => setViewDetail(tc) },
        { label: 'Edit', icon: 'edit', onClick: () => openEditModal(tc) },
        { separator: true },
        { label: 'Move Up', icon: 'moveUp', onClick: () => reorderTestCase(tc.testCaseId, 'up'), disabled: index === 0 },
        { label: 'Move Down', icon: 'moveDown', onClick: () => reorderTestCase(tc.testCaseId, 'down'), disabled: index === testCases.length - 1 },
        { separator: true },
        { label: 'Delete', icon: 'delete', danger: true, onClick: () => handleDelete(tc) }
    ];

    const getViewFields = (tc) => [
        { label: 'Test Case ID', value: tc.testCaseId },
        { label: 'Scenario ID', value: tc.scenarioId },
        { label: 'Steps', value: tc.steps },
        { label: 'Test Data', value: tc.testData },
        { label: 'Expected Result', value: tc.expectedResult },
        { label: 'Actual Result', value: tc.actualResult || 'Not executed' }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Test Cases</h2>
                    {showDescriptions && (
                        <p style={{ color: 'var(--color-text-muted)' }}>Define detailed test steps and expected results. Right-click a row for options.</p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                    <div className="search-bar" style={{ maxWidth: '240px' }}>
                        <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                        <input type="text" placeholder="Search test cases..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={openCreateModal} style={{ whiteSpace: 'nowrap' }}>
                        <Plus size={20} />
                        New Test Case
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '120px' }}>TC ID</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '120px' }}>Scenario</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Steps</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Expected Result</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Actual Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTestCases.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    {searchQuery ? 'No test cases match your search.' : 'No test cases found. Create one to get started.'}
                                </td>
                            </tr>
                        ) : (
                            filteredTestCases.map((tc, index) => (
                                <tr key={tc.testCaseId}
                                    style={{ borderBottom: '1px solid var(--color-border)', cursor: 'context-menu' }}
                                    className={contextMenu?.item?.testCaseId === tc.testCaseId ? 'context-active' : ''}
                                    onContextMenu={(e) => handleContextMenu(e, tc, index)}
                                    onDoubleClick={() => setViewDetail(tc)}
                                >
                                    <td style={{ padding: '16px', fontWeight: '500', whiteSpace: 'nowrap' }} title={tc.testCaseId}>{truncateId(tc.testCaseId)}</td>
                                    <td style={{ padding: '16px', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }} title={tc.scenarioId}>{truncateId(tc.scenarioId)}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div className="preserve-lines" title={tc.steps}>{tc.steps}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div className="preserve-lines" title={tc.expectedResult}>{tc.expectedResult}</div>
                                    </td>
                                    <td style={{ padding: '16px', color: tc.actualResult ? 'inherit' : 'var(--color-text-muted)' }}>
                                        <div className="preserve-lines" title={tc.actualResult || 'Not executed'}>{tc.actualResult || 'Not executed'}</div>
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
                onEdit={() => viewDetail && openEditModal(viewDetail)} title="Test Case Details"
                fields={viewDetail ? getViewFields(viewDetail) : []} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Test Case" : "Create New Test Case"}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Test Case ID</label>
                            <input required disabled={isEditMode} type="text" placeholder="TC-001"
                                value={formData.testCaseId} onChange={(e) => setFormData({ ...formData, testCaseId: e.target.value })}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)',
                                    backgroundColor: isEditMode ? 'var(--color-bg-app)' : undefined, cursor: isEditMode ? 'not-allowed' : 'text'
                                }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Scenario ID</label>
                            <select required value={formData.scenarioId}
                                onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                <option value="">Select Scenario</option>
                                {scenarios.map(s => (<option key={s.scenarioId} value={s.scenarioId}>{s.scenarioId} - {s.title}</option>))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Steps to Execute</label>
                        <textarea required rows="4" placeholder={"1. Navigate to login page\n2. Enter valid credentials"}
                            value={formData.steps} onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Test Data (Optional)</label>
                        <input type="text" placeholder="user=admin, pass=123"
                            value={formData.testData} onChange={(e) => setFormData({ ...formData, testData: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Expected Result</label>
                            <textarea required rows="3" placeholder="User should be logged in"
                                value={formData.expectedResult} onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Actual Result</label>
                            <textarea rows="3" placeholder="Pending execution..."
                                value={formData.actualResult} onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Test Case' : 'Create Test Case'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TestCaseManager;
