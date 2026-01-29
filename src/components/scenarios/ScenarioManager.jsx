import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../Shared/Modal';

const ScenarioManager = () => {
    const { scenarios, addScenario, deleteScenario, updateScenario } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        scenarioId: '',
        title: '',
        module: '',
        description: ''
    });
    const [error, setError] = useState('');

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
            if (isEditMode) {
                updateScenario(formData);
            } else {
                addScenario(formData);
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Test Scenarios</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your high-level test scenarios.</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={20} />
                    New Scenario
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>ID</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Title</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Module</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Description</th>
                            <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem', width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No scenarios found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            scenarios.map((scenario) => (
                                <tr key={scenario.scenarioId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{scenario.scenarioId}</td>
                                    <td style={{ padding: '16px' }}>{scenario.title}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: '#e0e7ff',
                                            color: '#3730a3',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            {scenario.module}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>{scenario.description}</td>
                                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openEditModal(scenario)}
                                            style={{ color: 'var(--color-primary)', padding: '4px' }}
                                            title="Edit Scenario"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteScenario(scenario.scenarioId)}
                                            style={{ color: 'var(--color-danger)', padding: '4px' }}
                                            title="Delete Scenario"
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Scenario" : "Create New Scenario"}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Scenario ID</label>
                        <input
                            required
                            disabled={isEditMode}
                            type="text"
                            placeholder="TS-001"
                            value={formData.scenarioId}
                            onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Title</label>
                        <input
                            required
                            type="text"
                            placeholder="User Login Flow"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Module</label>
                        <input
                            required
                            type="text"
                            placeholder="Authentication"
                            value={formData.module}
                            onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Description</label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        />
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
