import { useState } from 'react';
import { Plus, Trash2, ClipboardList, List, Link as LinkIcon } from 'lucide-react';
import Modal from '../common/Modal';

const TestCasesList = ({ testCases, scenarios, onAdd, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        scenarioId: '',
        steps: '',
        testData: '',
        expectedResults: '',
        actualResults: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            id: '',
            scenarioId: '',
            steps: '',
            testData: '',
            expectedResults: '',
            actualResults: ''
        });
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getScenarioValues = (id) => {
        const scenario = scenarios.find(s => s.id === id);
        return scenario ? `${scenario.id} - ${scenario.title}` : id;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)]">Test Cases</h2>
                    <p className="text-[var(--text-secondary)]">Create and manage test cases linked to scenarios.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    <Plus size={18} />
                    Add Test Case
                </button>
            </div>

            {testCases.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-[var(--primary-color)] mb-4">
                        <ClipboardList size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Test Cases</h3>
                    <p className="text-gray-500 mt-1 mb-6">Add a test case to validate your scenarios.</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
                        Create Test Case
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {testCases.map((tc) => (
                        <div key={tc.id} className="card hover:border-[var(--primary-color)] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="badge bg-blue-100 text-blue-800 border border-blue-200">{tc.id}</span>
                                    {tc.scenarioId && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            <LinkIcon size={12} />
                                            <span>Linked to: <strong>{getScenarioValues(tc.scenarioId)}</strong></span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => onDelete(tc.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <List size={16} className="text-gray-400" /> Steps
                                    </h4>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap font-mono text-xs">
                                        {tc.steps}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {tc.testData && (
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Test Data</h4>
                                            <p className="text-sm text-gray-800">{tc.testData}</p>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1">Expected Result</h4>
                                        <p className="text-sm text-gray-800">{tc.expectedResults}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Actual Result</h4>
                                        <p className="text-sm text-gray-600 italic">{tc.actualResults || 'Not executed yet'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Test Case Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Test Case"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                        <button onClick={handleSubmit} className="btn btn-primary">Add Test Case</button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Create a new test case linked to an existing scenario.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Test Case ID</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="e.g., TC-001"
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Scenario ID</label>
                            <select
                                name="scenarioId"
                                value={formData.scenarioId}
                                onChange={handleChange}
                                className="select"
                                required
                            >
                                <option value="">Select scenario</option>
                                {scenarios.map(s => (
                                    <option key={s.id} value={s.id}>{s.id} - {s.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
                        <textarea
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            placeholder={`1. Navigate to login page\n2. Enter credentials\n3. Click submit`}
                            className="textarea h-32 font-mono text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Data (Optional)</label>
                        <textarea
                            name="testData"
                            value={formData.testData}
                            onChange={handleChange}
                            placeholder="Username: test@example.com..."
                            className="textarea h-20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Results</label>
                        <textarea
                            name="expectedResults"
                            value={formData.expectedResults}
                            onChange={handleChange}
                            placeholder="User should be logged in successfully"
                            className="textarea h-20"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Results</label>
                        <textarea
                            name="actualResults"
                            value={formData.actualResults}
                            onChange={handleChange}
                            placeholder="Describe the actual outcome..."
                            className="textarea h-20"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TestCasesList;
