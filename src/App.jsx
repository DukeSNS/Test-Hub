import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import StatsCard from './components/dashboard/StatsCard';
import QuickActions from './components/dashboard/QuickActions';
import QuickStart from './components/dashboard/QuickStart';
import { DataProvider, useData } from './context/DataContext';
import ScenarioManager from './components/scenarios/ScenarioManager';
import TestCaseManager from './components/testcases/TestCaseManager';
import BugTrackerManager from './components/bugs/BugTrackerManager';
import Settings from './components/Settings/Settings';
import { FileText, CheckSquare, Bug, AlertCircle } from 'lucide-react';

const DashboardView = () => {
  const { scenarios, testCases, bugs } = useData();
  const stats = [
    { title: 'Total Scenarios', value: scenarios.length, icon: FileText, color: 'var(--color-primary)', trend: 0 },
    { title: 'Total Test Cases', value: testCases.length, icon: CheckSquare, color: 'var(--color-success)', trend: 0 },
    { title: 'Total Bugs', value: bugs.length, icon: Bug, color: 'var(--color-warning)', trend: 0 },
    { title: 'Open Bugs', value: bugs.filter(b => b.status === 'Open').length, icon: AlertCircle, color: 'var(--color-danger)', trend: 0 },
  ];

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Overview of your software testing project.</p>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <QuickActions />
        <QuickStart />
      </div>
    </>
  );
};

function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Scenarios':
        return <ScenarioManager />;
      case 'Test Cases':
        return <TestCaseManager />;
      case 'Bug Tracker':
        return <BugTrackerManager />;
      case 'Settings':
        return <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <div><h2>Not Found</h2></div>;
    }
  };

  return (
    <DataProvider>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {renderContent()}
      </Layout>
    </DataProvider>
  );
}

export default App;
