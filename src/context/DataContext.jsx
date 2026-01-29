import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // Load initial state from callbacks or empty arrays
    // For this prototype we'll start empty or with local storage if needed later
    const [scenarios, setScenarios] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [bugs, setBugs] = useState([]);

    const addScenario = (scenario) => {
        if (scenarios.some(s => s.scenarioId === scenario.scenarioId)) {
            throw new Error(`Scenario ID "${scenario.scenarioId}" already exists.`);
        }
        setScenarios([...scenarios, scenario]);
    };

    const addTestCase = (testCase) => {
        if (testCases.some(t => t.testCaseId === testCase.testCaseId)) {
            throw new Error(`Test Case ID "${testCase.testCaseId}" already exists.`);
        }
        setTestCases([...testCases, testCase]);
    };

    const addBug = (bug) => {
        if (bugs.some(b => b.bugId === bug.bugId)) {
            throw new Error(`Bug ID "${bug.bugId}" already exists.`);
        }
        setBugs([...bugs, bug]);
    };

    const updateScenario = (updatedScenario) => {
        setScenarios(scenarios.map(s => s.scenarioId === updatedScenario.scenarioId ? updatedScenario : s));
    };

    const updateTestCase = (updatedTestCase) => {
        setTestCases(testCases.map(t => t.testCaseId === updatedTestCase.testCaseId ? updatedTestCase : t));
    };

    const updateBug = (updatedBug) => {
        setBugs(bugs.map(b => b.bugId === updatedBug.bugId ? updatedBug : b));
    };

    const deleteScenario = (id) => {
        setScenarios(scenarios.filter(s => s.scenarioId !== id));
        // Optional: Cascade delete related test cases? Keeping it simple for now.
    };

    const deleteTestCase = (id) => {
        setTestCases(testCases.filter(t => t.testCaseId !== id));
    };

    const deleteBug = (id) => {
        setBugs(bugs.filter(b => b.bugId !== id));
    };

    // CSV Imports
    const importData = (data, type) => {
        if (type === 'scenarios') {
            // Filter out duplicates based on ID
            const newScenarios = data.filter(d => !scenarios.some(s => s.scenarioId === d.scenarioId));
            setScenarios([...scenarios, ...newScenarios]);
        } else if (type === 'testCases') {
            const newTestCases = data.filter(d => !testCases.some(t => t.testCaseId === d.testCaseId));
            setTestCases([...testCases, ...newTestCases]);
        } else if (type === 'bugs') {
            const newBugs = data.filter(d => !bugs.some(b => b.bugId === d.bugId));
            setBugs([...bugs, ...newBugs]);
        }
    };

    return (
        <DataContext.Provider value={{
            scenarios,
            testCases,
            bugs,
            addScenario,
            addTestCase,
            addBug,
            updateScenario,
            updateTestCase,
            updateBug,
            deleteScenario,
            deleteTestCase,
            deleteBug,
            importData
        }}>
            {children}
        </DataContext.Provider>
    );
};
