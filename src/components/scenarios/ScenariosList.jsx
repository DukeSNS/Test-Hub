import { useState } from 'react';
import { Plus, Trash2, FileText, Database } from 'lucide-react';
import Modal from '../common/Modal';

const ScenariosList = ({ scenarios, onAdd, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        module: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({ id: '', title: '', module: '', description: '' });
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)]">Test Scenarios</h2>
                    <p className="text-[var(--text-secondary)]">Manage your test scenarios and organize test cases.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    <Plus size={18} />
                    Add Scenario
                </button>
            </div>

            {scenarios.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-[var(--primary-color)] mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Scenarios yet</h3>
                    <p className="text-gray-500 mt-1 mb-6">Create a test scenario to get started.</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
                        Create Scenario
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards */}
                    {scenarios.map((scenario) => (
                        <div key={scenario.id} className="card group relative hover:border-[var(--primary-color)] transition-colors">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onDelete(scenario.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete Scenario"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <span className="badge bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-orange-200">
                                    {scenario.id}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.title}</h3>

                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                <Database size={14} className="text-gray-400" />
                                <span>Module: <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-800">{scenario.module || 'N/A'}</span></span>
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-3">
                                {scenario.description || 'No description provided.'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Scenario Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Test Scenario"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                        <button onClick={handleSubmit} className="btn btn-primary">Add Scenario</button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Create a new test scenario to organize your test cases.</p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scenario ID</label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="e.g., SCN-001"
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter scenario title"
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                        <input
                            type="text"
                            name="module"
                            value={formData.module}
                            onChange={handleChange}
                            placeholder="e.g., Authentication, Dashboard"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the test scenario..."
                            className="textarea"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ScenariosList;
