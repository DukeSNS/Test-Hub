import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
    SCENARIOS: 'testhub_scenarios',
    TEST_CASES: 'testhub_testcases',
    BUGS: 'testhub_bugs'
};

export const useDataManager = () => {
    const [scenarios, setScenarios] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [bugs, setBugs] = useState([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        const loadData = () => {
            try {
                const storedScenarios = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
                const storedTestCases = localStorage.getItem(STORAGE_KEYS.TEST_CASES);
                const storedBugs = localStorage.getItem(STORAGE_KEYS.BUGS);

                if (storedScenarios) setScenarios(JSON.parse(storedScenarios));
                if (storedTestCases) setTestCases(JSON.parse(storedTestCases));
                if (storedBugs) setBugs(JSON.parse(storedBugs));
            } catch (error) {
                console.error("Failed to load data from localStorage", error);
            }
        };
        loadData();
    }, []);

    // Sync to LocalStorage whenever data changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
    }, [scenarios]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.TEST_CASES, JSON.stringify(testCases));
    }, [testCases]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs));
    }, [bugs]);

    // Actions
    const addScenario = (scenario) => {
        setScenarios(prev => [...prev, scenario]);
    };

    const deleteScenario = (id) => {
        setScenarios(prev => prev.filter(item => item.id !== id));
        // Optional: Delete related test cases? For now, keep them but maybe orphan them or show warning.
    };

    const addTestCase = (testCase) => {
        setTestCases(prev => [...prev, testCase]);
    };

    const deleteTestCase = (id) => {
        setTestCases(prev => prev.filter(item => item.id !== id));
    };

    const addBug = (bug) => {
        setBugs(prev => [...prev, bug]);
    };

    const deleteBug = (id) => {
        setBugs(prev => prev.filter(item => item.id !== id));
    };

    const updateBugStatus = (id, status) => {
        setBugs(prev => prev.map(bug => bug.id === id ? { ...bug, status } : bug));
    }

    const importData = (type, data) => {
        if (type === 'scenarios') setScenarios([...scenarios, ...data]);
        if (type === 'testCases') setTestCases([...testCases, ...data]);
        if (type === 'bugs') setBugs([...bugs, ...data]);
    }

    return {
        scenarios,
        testCases,
        bugs,
        addScenario,
        deleteScenario,
        addTestCase,
        deleteTestCase,
        addBug,
        deleteBug,
        updateBugStatus,
        importData
    };
};
