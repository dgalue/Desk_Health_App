const ExerciseCard = ({ exercise, onDone }) => {
    if (!exercise) return null;

    return (
        <div className="exercise-card" style={{
            animation: 'slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1))',
                padding: '2rem',
                borderRadius: '1.5rem',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.75rem',
                    color: 'var(--primary-color)',
                    marginBottom: '0.5rem'
                }}>
                    Time to Move
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: '1.1' }}>
                    {exercise.name}
                </h2>

                <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem'
                }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{exercise.description}</p>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '1rem',
                        fontSize: '0.85rem',
                        color: 'var(--accent-color)'
                    }}>
                        Duration: {exercise.duration}
                    </div>
                </div>

                <button
                    onClick={onDone}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 12px rgba(129, 140, 248, 0.3)'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    I'm Done, Back to Work
                </button>
            </div>
        </div>
    );
};

export default ExerciseCard;
