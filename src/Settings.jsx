import { useState } from 'react';

const Settings = ({
    currentDuration,
    currentSchedule,
    currentWorkDays,
    currentMealDuration,
    currentMealSchedule,
    mealScheduleEnabled,
    audioSettings,
    notificationsEnabled,
    popToFrontEnabled,
    startupEnabled,
    onToggleStartup,
    onSave,
    onClose,
    isEmbedded = false
}) => {
    const [minutes, setMinutes] = useState(currentDuration / 60);
    const [schedule, setSchedule] = useState(currentSchedule || { start: '09:00', end: '17:00' });
    const [mealMinutes, setMealMinutes] = useState(currentMealDuration / 60);
    const [mealSchedule, setMealSchedule] = useState(currentMealSchedule || { start: '12:00', end: '13:00' });
    const [isMealEnabled, setIsMealEnabled] = useState(mealScheduleEnabled);
    const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(notificationsEnabled);
    const [isPopToFrontEnabled, setIsPopToFrontEnabled] = useState(popToFrontEnabled ?? true);

    // Weekly Schedule: which days are active
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [workDays, setWorkDays] = useState(currentWorkDays || [1, 2, 3, 4, 5]);

    const toggleDay = (dayIndex) => {
        setWorkDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex].sort()
        );
    };

    // Audio State
    const [soundEnabled, setSoundEnabled] = useState(audioSettings?.enabled ?? true);
    const [volume, setVolume] = useState(audioSettings?.volume ?? 0.5);
    const [soundType, setSoundType] = useState(audioSettings?.soundType ?? 'bell');

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--glass-border)',
        background: 'rgba(0,0,0,0.2)',
        color: 'white',
        fontSize: '1rem',
        fontFamily: 'inherit'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(
            minutes * 60,
            schedule,
            mealMinutes * 60,
            mealSchedule,
            isMealEnabled,
            { enabled: soundEnabled, volume, soundType },
            areNotificationsEnabled,
            isPopToFrontEnabled,
            workDays
        );
        onClose();
    };

    const containerStyle = isEmbedded ? {
        flex: 1, // Changed from height: 100% to flex: 1
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS/Android
        padding: '2rem',
        boxSizing: 'border-box', // Ensure padding doesn't add to width/height
        minHeight: 0 // Flexbox safety
    } : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    };

    const cardStyle = isEmbedded ? {
        background: 'transparent',
        padding: '0',
        borderRadius: '0',
        border: 'none',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'left'
    } : {
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '1rem',
        border: '1px solid var(--glass-border)',
        width: '90%',
        maxWidth: '320px',
        maxHeight: '85vh',
        overflowY: 'auto',
        textAlign: 'left'
    };

    return (
        <div className={isEmbedded ? "settings-page" : "settings-overlay"} style={containerStyle}>
            <div className="settings-card" style={cardStyle}>
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Settings</h2>


                <form onSubmit={handleSubmit}>
                    {/* Work Interval */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            Work Interval (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* Sound Settings */}
                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Sound & Notifications</h3>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                Enable Sound Effects
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={soundEnabled}
                                    onChange={(e) => setSoundEnabled(e.target.checked)}
                                    style={{ accentColor: 'var(--primary-color)', width: '1.2rem', height: '1.2rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: soundEnabled ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)', minWidth: '28px', textAlign: 'center' }}>
                                    {soundEnabled ? 'ON' : 'OFF'}
                                </span>
                            </label>
                        </div>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                Desktop Notifications
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={areNotificationsEnabled}
                                    onChange={(e) => setAreNotificationsEnabled(e.target.checked)}
                                    style={{ accentColor: 'var(--primary-color)', width: '1.2rem', height: '1.2rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: areNotificationsEnabled ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)', minWidth: '28px', textAlign: 'center' }}>
                                    {areNotificationsEnabled ? 'ON' : 'OFF'}
                                </span>
                            </label>
                        </div>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                Run on Startup
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={startupEnabled}
                                    onChange={(e) => onToggleStartup(e.target.checked)}
                                    style={{ accentColor: 'var(--primary-color)', width: '1.2rem', height: '1.2rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: startupEnabled ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)', minWidth: '28px', textAlign: 'center' }}>
                                    {startupEnabled ? 'ON' : 'OFF'}
                                </span>
                            </label>
                        </div>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                Pop to Front on Timer Complete
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={isPopToFrontEnabled}
                                    onChange={(e) => setIsPopToFrontEnabled(e.target.checked)}
                                    style={{ accentColor: 'var(--primary-color)', width: '1.2rem', height: '1.2rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: isPopToFrontEnabled ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)', minWidth: '28px', textAlign: 'center' }}>
                                    {isPopToFrontEnabled ? 'ON' : 'OFF'}
                                </span>
                            </label>
                        </div>

                        {soundEnabled && (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        Sound Preset
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {audioSettings?.presets?.map(preset => (
                                            <div key={preset.id} style={{ position: 'relative', flex: '1 1 auto' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onSave(
                                                            minutes * 60,
                                                            schedule,
                                                            mealMinutes * 60,
                                                            mealSchedule,
                                                            isMealEnabled,
                                                            { ...audioSettings, soundType: preset.id },
                                                            areNotificationsEnabled
                                                        );
                                                        setSoundType(preset.id); // Local update for preview state
                                                        // Preview sound using shared handler (stops previous sounds)
                                                        audioSettings.playSound({
                                                            type: preset.id,
                                                            force: true,
                                                            volume: volume
                                                        });
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '0.5rem',
                                                        border: soundType === preset.id ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                                                        background: soundType === preset.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.2)',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    {preset.name}
                                                </button>
                                                {preset.isCustom && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Delete sound "${preset.name}"?`)) {
                                                                audioSettings.deleteCustomSound(preset.id);
                                                            }
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-5px',
                                                            right: '-5px',
                                                            background: 'rgba(239, 68, 68, 0.9)',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: '16px',
                                                            height: '16px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '10px',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Upload Button */}
                                        <label
                                            style={{
                                                flex: '1 1 auto',
                                                padding: '0.5rem',
                                                borderRadius: '0.5rem',
                                                border: '1px dashed var(--glass-border)',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'rgba(255,255,255,0.7)',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.25rem'
                                            }}
                                            title="Max 2MB (MP3/WAV)"
                                        >
                                            <span>+ Add</span>
                                            <input
                                                type="file"
                                                accept="audio/mp3,audio/wav,audio/mpeg"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        alert("File too large (Max 2MB)");
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        audioSettings.addCustomSound(file.name.replace(/\.[^/.]+$/, ""), ev.target.result);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <span>Volume</span>
                                        <span>{Math.round(volume * 100)}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={volume}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setVolume(val);
                                            // Optional debug preview on drag end could be cleaner, but simple is ok
                                        }}
                                        style={{
                                            width: '100%',
                                            accentColor: 'var(--primary-color)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Work Schedule */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={schedule.start}
                                onChange={(e) => setSchedule({ ...schedule, start: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                End Time
                            </label>
                            <input
                                type="time"
                                value={schedule.end}
                                onChange={(e) => setSchedule({ ...schedule, end: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Weekly Schedule - Active Days */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            Active Days
                        </label>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {DAY_LABELS.map((label, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => toggleDay(idx)}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.5rem',
                                        border: workDays.includes(idx)
                                            ? '1px solid var(--primary-color)'
                                            : '1px solid rgba(255,255,255,0.15)',
                                        background: workDays.includes(idx)
                                            ? 'rgba(94, 106, 210, 0.2)'
                                            : 'rgba(0,0,0,0.2)',
                                        color: workDays.includes(idx)
                                            ? 'var(--primary-color)'
                                            : 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: workDays.includes(idx) ? 600 : 400,
                                        transition: 'all 0.15s ease',
                                        minWidth: '44px',
                                        textAlign: 'center'
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Meal Duration */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            Meal Break Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={mealMinutes}
                            onChange={(e) => setMealMinutes(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* Meal Schedule */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                Enable Meal Schedule
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={isMealEnabled}
                                    onChange={(e) => setIsMealEnabled(e.target.checked)}
                                    style={{ accentColor: 'var(--accent-color)', width: '1.2rem', height: '1.2rem' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: isMealEnabled ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)', minWidth: '28px', textAlign: 'center' }}>
                                    {isMealEnabled ? 'ON' : 'OFF'}
                                </span>
                            </label>
                        </div>

                        {isMealEnabled && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        Meal Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={mealSchedule.start}
                                        onChange={(e) => setMealSchedule({ ...mealSchedule, start: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        Meal End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={mealSchedule.end}
                                        onChange={(e) => setMealSchedule({ ...mealSchedule, end: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'flex-end',
                        marginTop: '2rem'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(94, 106, 210, 0.3)'
                            }}
                        >
                            Save
                        </button>
                    </div>
                </form >
            </div >
        </div >
    );
};

export default Settings;
