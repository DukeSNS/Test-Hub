import Papa from 'papaparse';

export const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
        alert('No data to export');
        return;
    }

    // Clean data for export (remove complex objects/images might be too large but for now let's keep it simple)
    // If screenshot is huge base64 it might be problematic for CSV but user requested it. 
    // Usually we don't put base64 in CSV but for a simple app it's "supported".

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
