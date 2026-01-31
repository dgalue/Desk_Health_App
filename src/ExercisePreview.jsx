const ExercisePreview = ({ exercise, onChangeExercise }) => {
    if (!exercise) return null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(129, 140, 248, 0.05))',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '1rem',
            padding: '1rem',
            marginTop: '1.5rem',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
            }}>
                <div style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--primary-color)'
                }}>
                    Up Next
                </div>
                <button
                    onClick={onChangeExercise}
                    style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--primary-color)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(56, 189, 248, 0.1)'}
                >
                    Change
                </button>
            </div>

            <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                color: 'white'
            }}>
                {exercise.name}
            </h3>

            <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '0.5rem',
                lineHeight: '1.4'
            }}>
                {exercise.description}
            </p>

            <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                background: 'rgba(129, 140, 248, 0.2)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--secondary-color)'
            }}>
                Duration: {exercise.duration}
            </div>
        </div>
    );
};

export default ExercisePreview;
