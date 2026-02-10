import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const STORAGE_KEYS = {
    SCENARIOS: 'testhub_scenarios',
    TEST_CASES: 'testhub_testcases',
    BUGS: 'testhub_bugs'
};

const loadFromStorage = (key) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error(`Failed to load ${key} from localStorage`, error);
        return [];
    }
};

export const DataProvider = ({ children }) => {
    const [scenarios, setScenarios] = useState(() => loadFromStorage(STORAGE_KEYS.SCENARIOS));
    const [testCases, setTestCases] = useState(() => loadFromStorage(STORAGE_KEYS.TEST_CASES));
    const [bugs, setBugs] = useState(() => loadFromStorage(STORAGE_KEYS.BUGS));
    const initialized = useRef(false);

    // Sync to localStorage whenever data changes (skip first render)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            return;
        }
        localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
    }, [scenarios]);

    useEffect(() => {
        if (!initialized.current) return;
        localStorage.setItem(STORAGE_KEYS.TEST_CASES, JSON.stringify(testCases));
    }, [testCases]);

    useEffect(() => {
        if (!initialized.current) return;
        localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs));
    }, [bugs]);

    // --- CRUD ---

    const addScenario = (scenario) => {
        if (scenarios.some(s => s.scenarioId === scenario.scenarioId)) {
            throw new Error(`Scenario ID "${scenario.scenarioId}" already exists.`);
        }
        setScenarios(prev => [...prev, scenario]);
    };

    const addTestCase = (testCase) => {
        if (testCases.some(t => t.testCaseId === testCase.testCaseId)) {
            throw new Error(`Test Case ID "${testCase.testCaseId}" already exists.`);
        }
        setTestCases(prev => [...prev, testCase]);
    };

    const addBug = (bug) => {
        if (bugs.some(b => b.bugId === bug.bugId)) {
            throw new Error(`Bug ID "${bug.bugId}" already exists.`);
        }
        setBugs(prev => [...prev, bug]);
    };

    const updateScenario = (updatedScenario) => {
        setScenarios(prev => prev.map(s => s.scenarioId === updatedScenario.scenarioId ? updatedScenario : s));
    };

    const updateTestCase = (updatedTestCase) => {
        setTestCases(prev => prev.map(t => t.testCaseId === updatedTestCase.testCaseId ? updatedTestCase : t));
    };

    const updateBug = (updatedBug) => {
        setBugs(prev => prev.map(b => b.bugId === updatedBug.bugId ? updatedBug : b));
    };

    // --- Linked deletion helpers ---

    const getLinkedTestCases = (scenarioId) => {
        return testCases.filter(t => t.scenarioId === scenarioId);
    };

    const deleteScenario = (id) => {
        setScenarios(prev => prev.filter(s => s.scenarioId !== id));
    };

    const deleteTestCase = (id) => {
        setTestCases(prev => prev.filter(t => t.testCaseId !== id));
    };

    const deleteBug = (id) => {
        setBugs(prev => prev.filter(b => b.bugId !== id));
    };

    // --- Reordering ---

    const reorderItem = (list, setList, idField, id, direction) => {
        setList(prev => {
            const arr = [...prev];
            const index = arr.findIndex(item => item[idField] === id);
            if (index === -1) return arr;
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= arr.length) return arr;
            [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
            return arr;
        });
    };

    const reorderScenario = (id, direction) => reorderItem(scenarios, setScenarios, 'scenarioId', id, direction);
    const reorderTestCase = (id, direction) => reorderItem(testCases, setTestCases, 'testCaseId', id, direction);
    const reorderBug = (id, direction) => reorderItem(bugs, setBugs, 'bugId', id, direction);

    // --- Import ---

    const importData = (data, type) => {
        if (type === 'scenarios') {
            const newScenarios = data.filter(d => !scenarios.some(s => s.scenarioId === d.scenarioId));
            setScenarios(prev => [...prev, ...newScenarios]);
        } else if (type === 'testCases') {
            const newTestCases = data.filter(d => !testCases.some(t => t.testCaseId === d.testCaseId));
            setTestCases(prev => [...prev, ...newTestCases]);
        } else if (type === 'bugs') {
            const newBugs = data.filter(d => !bugs.some(b => b.bugId === d.bugId));
            setBugs(prev => [...prev, ...newBugs]);
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
            getLinkedTestCases,
            reorderScenario,
            reorderTestCase,
            reorderBug,
            importData
        }}>
            {children}
        </DataContext.Provider>
    );
};
