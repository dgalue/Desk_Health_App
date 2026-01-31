import React from 'react';

const StatsModal = ({ stats, onClose }) => {
    const { today, currentStreak, bestStreak, history } = stats;

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            days.push({
                date: d,
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                data: history[key] || { exercisesCompleted: 0, minutesFocused: 0 }
            });
        }
        return days;
    };

    const last7Days = getLast7Days();

    // Stats Card Component
    const StatCard = ({ title, value, subtitle, color = 'var(--text-primary)' }) => (
        <div style={{
            background: 'var(--card-bg)', // Using surface-bg equivalent
            border: '1px solid var(--border-color)', // Subtle border
            borderRadius: '0.75rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
        }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                {title}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 600, color: color, fontVariantNumeric: 'tabular-nums' }}>
                {value}
            </div>
            {subtitle && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {subtitle}
                </div>
            )}
        </div>
    );

    return (
        <div style={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Performance</h2>
                {/* Close button optional if embedded, currently hidden */}
            </div>

            {/* Streak Hero */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(94, 106, 210, 0.15), rgba(94, 106, 210, 0.05))',
                border: '1px solid rgba(94, 106, 210, 0.2)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <div style={{
                    fontSize: '2.5rem',
                    background: 'rgba(94, 106, 210, 0.2)',
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3z" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        Current Streak
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {currentStreak} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>days</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                        Best: <span style={{ color: 'var(--text-secondary)' }}>{bestStreak} days</span>
                    </div>
                </div>
            </div>

            {/* Grid Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <StatCard
                    title="Exercises Today"
                    value={today.exercisesCompleted}
                    subtitle="Target: 8/day"
                />
                <StatCard
                    title="Focus Time"
                    value={`${Math.round(today.minutesFocused)}m`}
                    subtitle="Today's Total"
                />
            </div>

            {/* Chart Section */}
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Last 7 Days
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '0.75rem', paddingTop: '1rem' }}>
                    {last7Days.map((day, idx) => {
                        const isToday = idx === 6;
                        // Max reliable height scaling ref (e.g., 10 exercises)
                        const heightPct = Math.min(100, Math.max(10, (day.data.exercisesCompleted / 8) * 100));

                        return (
                            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%' }}>
                                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '24px',
                                        height: `${heightPct}%`,
                                        background: isToday ? 'var(--primary-color)' : 'var(--border-color)',
                                        borderRadius: '4px',
                                        minHeight: '4px',
                                        transition: 'all 0.3s ease',
                                        opacity: isToday ? 1 : 0.5
                                    }}
                                        title={`${day.data.exercisesCompleted} exercises`}
                                    />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: isToday ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 500 }}>
                                    {day.label[0]}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatsModal;
