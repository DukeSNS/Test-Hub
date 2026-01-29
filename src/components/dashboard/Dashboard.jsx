import { LayoutDashboard, FileText, ClipboardList, AlertCircle, Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import Papa from 'papaparse';

const Dashboard = ({ stats, onImport, onExport }) => {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                // Heuristic to guess type based on columns
                const fields = results.meta.fields;
                let type = null;
                if (fields.includes('scenarioId')) type = 'testCases';
                else if (fields.includes('severity')) type = 'bugs';
                else if (fields.includes('module')) type = 'scenarios';

                if (type) {
                    onImport(type, results.data);
                    alert(`Imported ${results.data.length} items to ${type}`);
                } else {
                    alert('Could not determine data type from CSV headers. Ensure standard headers are used.');
                }

                // Reset
                e.target.value = '';
            },
            error: (err) => {
                alert('Error parsing CSV: ' + err.message);
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-main)]">Dashboard</h2>
                    <p className="text-[var(--text-secondary)]">Overview of your software testing project.</p>
                </div>

                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv"
                    />
                    <button onClick={handleImportClick} className="btn btn-secondary flex items-center gap-2">
                        <Upload size={18} />
                        Import CSV
                    </button>

                    <div className="relative group">
                        <button className="btn btn-secondary flex items-center gap-2">
                            <Download size={18} />
                            Export CSV
                        </button>
                        {/* Dropdown for export */}
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 shadow-xl rounded-md overflow-hidden hidden group-hover:block z-10 animate-fade-in">
                            <div onClick={() => onExport('scenarios')} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium">Scenarios</div>
                            <div onClick={() => onExport('testCases')} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium">Test Cases</div>
                            <div onClick={() => onExport('bugs')} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium">Bugs</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Scenarios"
                    value={stats.scenarios}
                    icon={<FileText className="text-orange-600" size={24} />}
                    color="bg-orange-50 border-orange-100"
                />
                <StatCard
                    title="Total Test Cases"
                    value={stats.testCases}
                    icon={<ClipboardList className="text-blue-600" size={24} />}
                    color="bg-blue-50 border-blue-100"
                />
                <StatCard
                    title="Total Bugs"
                    value={stats.bugs}
                    icon={<AlertCircle className="text-red-600" size={24} />}
                    color="bg-red-50 border-red-100"
                />
                <StatCard
                    title="Open Bugs"
                    value={stats.openBugs}
                    icon={<AlertCircle className="text-yellow-600" size={24} />}
                    color="bg-yellow-50 border-yellow-100"
                />
            </div>

            <div className="bg-white p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Start Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-gray-900 border border-gray-200 mb-3 shadow-sm">1</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Create Scenarios</h4>
                        <p className="text-sm text-gray-600">Define high-level test scenarios to group your testing efforts logically by feature or module.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-gray-900 border border-gray-200 mb-3 shadow-sm">2</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Add Test Cases</h4>
                        <p className="text-sm text-gray-600">Create specific test cases linked to scenarios with detailed steps, test data, and expected results.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-gray-900 border border-gray-200 mb-3 shadow-sm">3</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Track Bugs</h4>
                        <p className="text-sm text-gray-600">Log any issues found during execution, attach screenshots, and track their status until resolution.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl border ${color} flex items-center justify-between transition-transform hover:-translate-y-1`}>
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 bg-opacity-60">
            {icon}
        </div>
    </div>
);

export default Dashboard;
