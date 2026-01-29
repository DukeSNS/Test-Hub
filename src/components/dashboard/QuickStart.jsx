import React from 'react';

const QuickStart = () => {
    const steps = [
        { number: 1, title: 'Create a Scenario', desc: 'Define high-level testing scenarios for your project.' },
        { number: 2, title: 'Add Test Cases', desc: 'Break down scenarios into detailed test steps.' },
        { number: 3, title: 'Run Tests', desc: 'Execute tests and log the results.' },
        { number: 4, title: 'Report Bugs', desc: 'Log any issues found directly to the tracker.' },
    ];

    return (
        <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Quick Start Guide</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {steps.map((step) => (
                    <div key={step.number} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                        }}>
                            {step.number}
                        </div>
                        <h4 style={{ fontSize: '1rem' }}>{step.title}</h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickStart;
