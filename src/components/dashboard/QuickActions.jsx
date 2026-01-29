import React, { useRef, useState } from 'react';
import { Upload, Download, FileJson } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Toast from '../Shared/Toast';

const QuickActions = () => {
    const { scenarios, testCases, bugs, importData } = useData();
    const fileInputRef = useRef(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'json') {
            // Handle JSON import
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    let totalImported = 0;

                    if (data.scenarios && Array.isArray(data.scenarios)) {
                        importData(data.scenarios, 'scenarios');
                        totalImported += data.scenarios.length;
                    }
                    if (data.testCases && Array.isArray(data.testCases)) {
                        importData(data.testCases, 'testCases');
                        totalImported += data.testCases.length;
                    }
                    if (data.bugs && Array.isArray(data.bugs)) {
                        importData(data.bugs, 'bugs');
                        totalImported += data.bugs.length;
                    }

                    showToast(`Successfully imported ${totalImported} items!`, 'success');
                } catch (err) {
                    showToast('Error parsing JSON file: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // Handle Excel import
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    let totalImported = 0;

                    // Import Scenarios sheet
                    if (workbook.SheetNames.includes('Scenarios')) {
                        const scenariosSheet = workbook.Sheets['Scenarios'];
                        const scenariosData = XLSX.utils.sheet_to_json(scenariosSheet);
                        if (scenariosData.length > 0) {
                            importData(scenariosData, 'scenarios');
                            totalImported += scenariosData.length;
                        }
                    }

                    // Import Test Cases sheet
                    if (workbook.SheetNames.includes('Test Cases')) {
                        const testCasesSheet = workbook.Sheets['Test Cases'];
                        const testCasesData = XLSX.utils.sheet_to_json(testCasesSheet);
                        if (testCasesData.length > 0) {
                            importData(testCasesData, 'testCases');
                            totalImported += testCasesData.length;
                        }
                    }

                    // Import Bugs sheet
                    if (workbook.SheetNames.includes('Bugs')) {
                        const bugsSheet = workbook.Sheets['Bugs'];
                        const bugsData = XLSX.utils.sheet_to_json(bugsSheet);
                        if (bugsData.length > 0) {
                            importData(bugsData, 'bugs');
                            totalImported += bugsData.length;
                        }
                    }

                    if (totalImported > 0) {
                        showToast(`Successfully imported ${totalImported} items from Excel!`, 'success');
                    } else {
                        showToast('No data found in Excel file', 'error');
                    }
                } catch (err) {
                    showToast('Error parsing Excel file: ' + err.message, 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (fileExtension === 'csv') {
            // Handle CSV import
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const data = results.data;
                    if (!data || data.length === 0) {
                        showToast('CSV file is empty', 'error');
                        return;
                    }

                    const keys = Object.keys(data[0]);
                    if (keys.includes('scenarioId')) {
                        importData(data, 'scenarios');
                        showToast(`Imported ${data.length} Scenarios`, 'success');
                    } else if (keys.includes('testCaseId')) {
                        importData(data, 'testCases');
                        showToast(`Imported ${data.length} Test Cases`, 'success');
                    } else {
                        showToast('Unknown CSV format. Could not match headers.', 'error');
                    }
                },
                error: (err) => {
                    showToast('Error parsing CSV: ' + err.message, 'error');
                }
            });
        } else {
            showToast('Unsupported file format. Please use JSON, CSV, or Excel (.xlsx).', 'error');
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleExport = () => {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Create worksheet for Scenarios
        const scenariosWS = XLSX.utils.json_to_sheet(scenarios);
        XLSX.utils.book_append_sheet(workbook, scenariosWS, 'Scenarios');

        // Create worksheet for Test Cases
        const testCasesWS = XLSX.utils.json_to_sheet(testCases);
        XLSX.utils.book_append_sheet(workbook, testCasesWS, 'Test Cases');

        // Create worksheet for Bugs (filter out data URLs from screenshots)
        const bugsForExport = bugs.map(bug => ({
            ...bug,
            screenshot: bug.screenshotName || (bug.screenshot ? 'Attached' : ''),
            screenshotName: undefined
        }));
        const bugsWS = XLSX.utils.json_to_sheet(bugsForExport);
        XLSX.utils.book_append_sheet(workbook, bugsWS, 'Bugs');

        // Generate Excel file
        XLSX.writeFile(workbook, `testhub_export_${new Date().toISOString().split('T')[0]}.xlsx`);

        showToast('Data exported successfully!', 'success');
    };

    const generateReport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalScenarios: scenarios.length,
                totalTestCases: testCases.length,
                totalBugs: bugs.length,
                openBugs: bugs.filter(b => b.status === 'Open').length,
                closedBugs: bugs.filter(b => b.status === 'Closed').length,
                criticalBugs: bugs.filter(b => b.severity === 'Critical').length
            },
            scenarios: scenarios,
            testCases: testCases,
            bugs: bugs
        };

        const json = JSON.stringify(report, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `test_report_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        showToast('Report generated successfully!', 'success');
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".csv,.json,.xlsx,.xls"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        />
                        <button className="btn btn-primary" style={{ position: 'relative', zIndex: 1 }}>
                            <Upload size={18} />
                            Import Data
                        </button>
                    </div>

                    <button className="btn btn-secondary" onClick={handleExport}>
                        <Download size={18} />
                        Export All Data
                    </button>

                    <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={generateReport}>
                        <FileJson size={18} />
                        Generate Report
                    </button>
                </div>
                <p style={{ marginTop: '12px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Supported formats: JSON, CSV, Excel (.xlsx). Excel files can contain multiple sheets.
                </p>
            </div>
        </>
    );
};

export default QuickActions;
