# Changelog

## [2.0.0] - 2026-02-10

### Added
- **Japandi Theme**: Introduced a new visual theme featuring serene organic tones in cream and tan.
- **View Detail Modal**: New modal for viewing full details of Scenarios, Test Cases, and Bugs with support for long text.
- **Context Menus**: Right-click context menus added to all data tables for quicker access to actions (View, Edit, Move, Delete).
- **Search Functionality**: Implemented search bars in all manager views to filter records by ID, title, or content.
- **Display Preferences**: Users can now toggle visibility of page descriptions and the Quick Start guide via Settings.
- **Data Persistence**: Application state (Scenarios, Test Cases, Bugs) now persists across browser sessions using local storage.
- **Row Reordering**: Added ability to move items up or down in the list.

### Changed
- **UI Polish**: Improved button layout to prevent text wrapping and refined search bar width.
- **ID Truncation**: imposed strict 10-character truncation on ID columns to maintain clean table layouts.
- **Text Rendering**: Preserved line breaks and indentation in text fields (Descriptions, Steps, Results) within tables and modals.
- **Deletion Logic**: Enhanced deletion safety with confirmation dialogs, specifically warning when deleting Scenarios with linked Test Cases.

### Fixed
- **Table Layout**: Fixed column widths and text overflow issues in data tables.

## [1.0.0] - 2026-01-29

### Added
- Initial release of TestHub.
- Dashboard with key metrics.
- Scenario Management.
- Test Case Management.
- Bug Tracking.
- Dark/Light Mode support.
