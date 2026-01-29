import { useState, useRef } from 'react';
import { Plus, Trash2, AlertCircle, Upload, Image as ImageIcon, X } from 'lucide-react';
import Modal from '../common/Modal';

const BugTracker = ({ bugs, onAdd, onDelete, onUpdateStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        id: '',
        module: '',
        summary: '',
        steps: '',
        expectedResults: '',
        actualResults: '',
        severity: 'Major',
        priority: 'Medium',
        status: 'Open',
        screenshot: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            id: '',
            module: '',
            summary: '',
            steps: '',
            expectedResults: '',
            actualResults: '',
            severity: 'Major',
            priority: 'Medium',
            status: 'Open',
            screenshot: null
        });
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, screenshot: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, screenshot: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const getSeverityColor = (severity) => {
        const map = {
            'Critical': 'text-red-700 bg-red-100 border-red-200',
            'Major': 'text-orange-700 bg-orange-100 border-orange-200',
            'Minor': 'text-yellow-700 bg-yellow-100 border-yellow-200'
        };
        return map[severity] || 'text-gray-700 bg-gray-100';
    };

    const getPriorityColor = (priority) => {
        const map = {
            'High': 'text-red-600',
            'Medium': 'text-orange-600',
            'Low': 'text-green-600'
        };
        return map[priority] || 'text-gray-600';
    };

    const getStatusColor = (status) => {
        const map = {
            'Open': 'bg-red-500',
            'In Progress': 'bg-blue-500',
            'Resolved': 'bg-green-500',
            'Closed': 'bg-gray-500'
        };
        return map[status] || 'bg-gray-500';
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)]">Bug Tracker</h2>
                    <p className="text-[var(--text-secondary)]">Report and track bugs with detailed information.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    <Plus size={18} />
                    Report Bug
                </button>
            </div>

            {bugs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Bugs Reported</h3>
                    <p className="text-gray-500 mt-1 mb-6">Found an issue? Report it here.</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
                        Report Bug
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bugs.map((bug) => (
                        <div key={bug.id} className="card flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-bold text-gray-500">#{bug.id}</span>
                                    <h3 className="text-lg font-bold text-gray-900">{bug.summary}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(bug.severity)}`}>
                                        {bug.severity}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Module: <span className="font-medium text-gray-700">{bug.module}</span></span>
                                    <span>Priority: <span className={`font-medium ${getPriorityColor(bug.priority)}`}>{bug.priority}</span></span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md text-sm">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-1">Expected</h4>
                                        <p className="text-gray-600">{bug.expectedResults}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-1">Actual</h4>
                                        <p className="text-gray-600">{bug.actualResults}</p>
                                    </div>
                                </div>

                                {bug.screenshot && (
                                    <div className="mt-2">
                                        <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                            <ImageIcon size={12} /> Screenshot Attached
                                        </p>
                                        <img src={bug.screenshot} alt="Bug screenshot" className="h-20 w-auto rounded border border-gray-200 object-cover cursor-pointer hover:opacity-90" onClick={() => {
                                            const w = window.open("");
                                            w.document.write(`<img src="${bug.screenshot}" />`);
                                        }} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getStatusColor(bug.status)}`}></span>
                                    <select
                                        value={bug.status}
                                        onChange={(e) => onUpdateStatus(bug.id, e.target.value)}
                                        className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer hover:underline pl-0"
                                    >
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Resolved</option>
                                        <option>Closed</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => onDelete(bug.id)}
                                    className="btn btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600 w-full md:w-auto mt-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Report Bug Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Report a Bug"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                        <button onClick={handleSubmit} className="btn btn-primary">Add Bug</button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Document a bug with all relevant details for tracking.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bug ID</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="e.g., BUG-001"
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
                                placeholder="e.g., Authentication"
                                className="input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                        <input
                            type="text"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            placeholder="Brief description of the bug"
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
                        <textarea
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            placeholder={`1. Go to...\n2. Click on...\n3. Observe...`}
                            className="textarea h-24"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Results</label>
                            <textarea
                                name="expectedResults"
                                value={formData.expectedResults}
                                onChange={handleChange}
                                placeholder="What should happen"
                                className="textarea"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Results</label>
                            <textarea
                                name="actualResults"
                                value={formData.actualResults}
                                onChange={handleChange}
                                placeholder="What actually happened"
                                className="textarea"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select name="severity" value={formData.severity} onChange={handleChange} className="select">
                                <option>Critical</option>
                                <option>Major</option>
                                <option>Minor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="select">
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="select">
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Screenshot (Optional)</label>
                        <div
                            onClick={triggerFileInput}
                            className="border border-gray-300 rounded-md p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-dashed"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            {formData.screenshot ? (
                                <div className="relative group w-full flex justify-center">
                                    <img src={formData.screenshot} alt="Preview" className="h-32 object-contain" />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Upload size={18} />
                                    <span className="text-sm font-medium">Upload Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BugTracker;
