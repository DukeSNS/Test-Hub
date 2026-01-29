# TestHub

**A modern, feature-rich QA management system for tracking test scenarios, test cases, and bugs with Excel import/export and dark mode support.**

---

## 🚀 Features

- **📋 Test Scenario Management** - Create, edit, and organize test scenarios with unique IDs
- **✅ Test Case Tracking** - Define detailed test steps, expected results, and actual outcomes
- **🐛 Bug Tracker** - Report and track bugs with severity levels, priorities, and screenshot attachments
- **📊 Dashboard** - Real-time statistics and quick actions for efficient workflow
- **📤 Excel Export/Import** - Export all data to Excel with 3 separate sheets (Scenarios, Test Cases, Bugs)
- **🌓 Dark Mode** - Toggle between light and dark themes with localStorage persistence
- **📱 Responsive Design** - Collapsible sidebar that adapts content layout dynamically
- **🖼️ Image Viewer** - Built-in modal viewer for bug screenshots
- **✨ Toast Notifications** - User-friendly feedback for all actions
- **🔒 Duplicate Prevention** - Automatic validation to prevent duplicate IDs

---

## 🛠️ Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **XLSX (SheetJS)** - Excel file handling
- **PapaParse** - CSV parsing
- **CSS Variables** - Theme management

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DukeSNS/Test-Hub.git
   cd Test-Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🎯 Usage

### Managing Test Scenarios
1. Navigate to **Scenarios** from the sidebar
2. Click **New Scenario** to create a test scenario
3. Fill in Scenario ID, Title, Description, and Priority
4. Edit or delete scenarios as needed

### Creating Test Cases
1. Go to **Test Cases** section
2. Click **New Test Case**
3. Select a Scenario ID from the dropdown
4. Define test steps, expected results, and test data
5. Execute tests and record actual results

### Reporting Bugs
1. Open **Bug Tracker**
2. Click **Report New Bug**
3. Upload screenshots (optional)
4. Set severity, priority, and status
5. Click on screenshot filenames to view images in full-screen modal

### Import/Export Data
- **Export**: Click "Export All Data" to download an Excel file with 3 sheets
- **Import**: Click "Import Data" and select JSON, CSV, or Excel (.xlsx) files
- Supports round-trip: Export → Import maintains all data

### Dark Mode
1. Navigate to **Settings**
2. Toggle the Dark Mode switch
3. Theme preference is saved automatically

---

## 📸 Screenshots

### Dashboard (Light Mode)
![Dashboard](screenshots/dashboard-light.png)

### Bug Tracker (Dark Mode)
![Bug Tracker](screenshots/bug-tracker-dark.png)

### Excel Export
![Excel Export](screenshots/excel-export.png)

---

## 🎨 Features in Detail

### Duplicate ID Prevention
TestHub automatically validates IDs for Scenarios, Test Cases, and Bugs to prevent duplicates. If you try to create an item with an existing ID, you'll see a clear error message.

### Excel Import/Export
- **Export**: Creates a single .xlsx file with 3 sheets (Scenarios, Test Cases, Bugs)
- **Import**: Reads all sheets from Excel files and imports data automatically
- Screenshot data is handled intelligently (filenames only in exports)

### Responsive Layout
The sidebar can be collapsed to an icon-only view (80px), and the main content area automatically expands to use the extra space. Perfect for maximizing screen real estate when working with large tables.

### Image Viewer
Bug screenshots are stored as data URLs and displayed in a beautiful modal viewer with:
- Full-screen overlay
- Proper padding and spacing
- Dark mode compatible text
- Click outside or close button to dismiss

---

## 🔧 Configuration

### Customizing Colors
Edit `src/index.css` to modify the color scheme:
```css
:root {
  --color-primary: #4f46e5;  /* Change primary color */
  --color-success: #10b981;  /* Success color */
  --color-danger: #f43f5e;   /* Danger/error color */
  /* ... more variables */
}
```

### Dark Mode Colors
Dark mode colors are defined in the `[data-theme="dark"]` selector in `src/index.css`.

---

## 📝 Data Format

### Export Format (Excel)
The Excel export creates 3 sheets:

**Scenarios Sheet:**
- scenarioId
- title
- description
- priority

**Test Cases Sheet:**
- testCaseId
- scenarioId
- steps
- testData
- expectedResult
- actualResult

**Bugs Sheet:**
- bugId
- summary
- description
- module
- severity
- priority
- status
- screenshot (filename only)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Excel handling by [SheetJS](https://sheetjs.com/)
- CSV parsing by [PapaParse](https://www.papaparse.com/)

---

## 📧 Contact

Project Link: [https://github.com/DukeSNS/Test-Hub](https://github.com/DukeSNS/Test-Hub)

---

**Made with ❤️ for QA teams everywhere**
