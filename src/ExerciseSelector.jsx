import { exercises } from './exercises';

const ExerciseSelector = ({ onSelect }) => {
    return (
        <div className="exercise-selector" style={{
            animation: 'fadeIn 0.5s ease-out',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Choose Your Move</h2>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem',
                paddingRight: '0.5rem',
                paddingBottom: '1rem'
            }}>
                {exercises.map((ex) => (
                    <div
                        key={ex.id}
                        onClick={() => onSelect(ex)}
                        className="exercise-option"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                            {ex.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                            {ex.duration}
                        </div>
                        <div style={{
                            marginTop: '0.5rem',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            opacity: 0.5
                        }}>
                            {ex.category}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseSelector;
