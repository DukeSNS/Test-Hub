import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../Shared/Modal';

const TestCaseManager = () => {
    const { testCases, scenarios, addTestCase, updateTestCase, deleteTestCase } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        testCaseId: '',
        scenarioId: '',
        steps: '',
        testData: '',
        expectedResult: '',
        actualResult: ''
    });

    const openCreateModal = () => {
        setFormData({
            testCaseId: '',
            scenarioId: '',
            steps: '',
            testData: '',
            expectedResult: '',
            actualResult: ''
        });
        setIsEditMode(false);
        setIsModalOpen(true);
        setError('');
    };

    const openEditModal = (testCase) => {
        setFormData(testCase);
        setIsEditMode(true);
        setIsModalOpen(true);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                updateTestCase(formData);
            } else {
                addTestCase(formData);
            }
            setIsModalOpen(false);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Test Cases</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Define detailed test steps and expected results.</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={20} />
                    New Test Case
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>TC ID</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Scenario</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Steps</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Expected Result</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Actual Result</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testCases.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No test cases found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            testCases.map((tc, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{tc.testCaseId}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{tc.scenarioId}</span>
                                    </td>
                                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                                        <div style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>{tc.steps}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{tc.expectedResult}</td>
                                    <td style={{ padding: '16px', color: tc.actualResult ? 'inherit' : 'var(--color-text-muted)' }}>
                                        {tc.actualResult || 'Not executed'}
                                    </td>
                                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openEditModal(tc)}
                                            style={{ color: 'var(--color-primary)', padding: '4px' }}
                                            title="Edit Test Case"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteTestCase(tc.testCaseId)}
                                            style={{ color: 'var(--color-danger)', padding: '4px' }}
                                            title="Delete Test Case"
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Test Case" : "Create New Test Case"}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Test Case ID</label>
                            <input
                                required
                                disabled={isEditMode}
                                type="text"
                                placeholder="TC-001"
                                value={formData.testCaseId}
                                onChange={(e) => setFormData({ ...formData, testCaseId: e.target.value })}
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
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Scenario ID</label>
                            <select
                                required
                                value={formData.scenarioId}
                                onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}
                            >
                                <option value="">Select Scenario</option>
                                {scenarios.map(s => (
                                    <option key={s.scenarioId} value={s.scenarioId}>{s.scenarioId} - {s.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Steps to Execute</label>
                        <textarea
                            required
                            rows="4"
                            placeholder="1. Navigate to login page&#10;2. Enter valid credentials"
                            value={formData.steps}
                            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Test Data (Optional)</label>
                        <input
                            type="text"
                            placeholder="user=admin, pass=123"
                            value={formData.testData}
                            onChange={(e) => setFormData({ ...formData, testData: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Expected Result</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="User should be logged in"
                                value={formData.expectedResult}
                                onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Actual Result</label>
                            <textarea
                                rows="3"
                                placeholder="Pending execution..."
                                value={formData.actualResult}
                                onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                            />
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
