import React, { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import Settings from './Settings';
import ExerciseCard from './ExerciseCard';
import ExerciseSelector from './ExerciseSelector';
import ExercisePreview from './ExercisePreview';
import ExerciseManager from './ExerciseManager';
import StatsModal from './StatsModal';
import { useExercises } from './hooks/useExercises';
import { useProgress } from './hooks/useProgress';
import { useAudio } from './hooks/useAudio';

// --- Icons ---
const Icons = {
  Timer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
  BarChart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  Utensils: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
};

// --- Sidebar Component ---
const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'TIMER', label: 'Focus', icon: <Icons.Timer /> },
    { id: 'EXERCISES', label: 'Exercises', icon: <Icons.List /> },
    { id: 'STATS', label: 'Stats', icon: <Icons.BarChart /> },
    { id: 'SETTINGS', label: 'Settings', icon: <Icons.Settings /> },
  ];

  return (
    <div style={{
      width: '240px',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      flexShrink: 0
    }}>
      {/* Brand */}
      <div style={{ paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.9 }}>
        <img src="icon.png" alt="Desk Health" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
        <h1 style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>Desk Health</h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', paddingLeft: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Menu
        </div>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: activeView === item.id ? 'rgba(94, 106, 210, 0.08)' : 'transparent',
              color: activeView === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.1s ease'
            }}
          >
            <span style={{ opacity: activeView === item.id ? 1 : 0.7, display: 'flex' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div style={{ marginTop: 'auto', paddingLeft: '0.75rem', fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
        <div><strong style={{ color: 'var(--primary-color)' }}>Desk Health</strong> v1.0.0</div>
        <div>Made with ❤️ by Diego Galue</div>
      </div>
    </div>
  );
};

function App() {
  // Navigation State
  const [activeView, setActiveView] = useState('TIMER');

  // Exercise Management
  const {
    allExercises,
    enabledExercises,
    customExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    toggleExerciseEnabled,
    isExerciseEnabled,
    moveExerciseUp,
    moveExerciseDown,
    reorderExercises
  } = useExercises();

  // Configuration State
  const [workDuration, setWorkDuration] = useState(45 * 60);
  const [mealDuration, setMealDuration] = useState(60 * 60);
  const [schedule, setSchedule] = useState({ start: '09:00', end: '17:00' });

  const [mealSchedule, setMealSchedule] = useState({ start: '12:00', end: '13:00' });
  const [mealScheduleEnabled, setMealScheduleEnabled] = useState(() => {
    const saved = localStorage.getItem('mealScheduleEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [popToFrontEnabled, setPopToFrontEnabled] = useState(() => {
    const saved = localStorage.getItem('popToFrontEnabled');
    if (saved === null || saved === 'undefined' || saved === undefined) return true;
    try { return JSON.parse(saved); } catch { return true; }
  });

  // Runtime State
  const [currentDuration, setCurrentDuration] = useState(workDuration);
  const [timeLeft, setTimeLeft] = useState(workDuration); // Lifted from Timer component
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('WORK'); // 'WORK', 'MEAL', 'EXERCISE'
  const [isOffDuty, setIsOffDuty] = useState(false);

  // Ref to hold the latest handleTimerComplete to avoid stale closures
  const handleTimerCompleteRef = useRef(null);
  const timerCompletedRef = useRef(false); // Track if timer already completed

  // Timer countdown - runs in App.jsx so it continues when navigating views
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      timerCompletedRef.current = false; // Reset when timer is running
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0 && handleTimerCompleteRef.current && !timerCompletedRef.current) {
            timerCompletedRef.current = true; // Mark as completed to prevent double call
            // Schedule complete handler for next tick to avoid state update during render
            setTimeout(() => handleTimerCompleteRef.current(), 0);
          }
          return Math.max(0, newTime);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]); // Remove timeLeft from dependencies to prevent re-runs

  // UI State (Sub-states for Timer View)
  const [showSelector, setShowSelector] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  const [lastExerciseId, setLastExerciseId] = useState(() => localStorage.getItem('lastExerciseId') || null);

  // Derived State: Calculate upcoming exercise based on rotation
  const upcomingExercise = React.useMemo(() => {
    if (enabledExercises.length === 0) return null;
    const lastIndex = enabledExercises.findIndex(ex => (ex.id || ex.name) === lastExerciseId);
    // If last not found (or null), start at 0. Else next in circle.
    const nextIndex = (lastIndex === -1) ? 0 : (lastIndex + 1) % enabledExercises.length;
    return enabledExercises[nextIndex];
  }, [enabledExercises, lastExerciseId]);

  // Progress Tracking
  const { logExercise, logFocusTime, stats } = useProgress();

  // Audio Management
  const { playSound, enabled: soundEnabled, volume, soundType, setEnabled: setSoundEnabled, setVolume, setSoundType, presets, addCustomSound, deleteCustomSound } = useAudio();

  useEffect(() => {
    if (lastExerciseId) {
      localStorage.setItem('lastExerciseId', lastExerciseId);
    }
  }, [lastExerciseId]);

  // Log focus time every minute when active
  useEffect(() => {
    let interval;
    if (isActive && mode === 'WORK') {
      interval = setInterval(() => {
        logFocusTime(1);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isActive, mode, logFocusTime]);

  const [permission, setPermission] = useState(() => {
    return 'Notification' in window ? Notification.permission : 'default';
  });

  const prevOffDutyRef = useRef(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  // Startup State
  const [startupEnabled, setStartupEnabled] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getStartupStatus().then(setStartupEnabled);
    }
  }, []);

  const handleToggleStartup = (enabled) => {
    setStartupEnabled(enabled);
    if (window.electronAPI) {
      window.electronAPI.toggleStartup(enabled);
    }
  };

  // Ref to track previous workDuration to detect actual changes
  const prevWorkDurationRef = useRef(workDuration);

  // Sync timeLeft ONLY when workDuration setting actually changes (not on pause)
  useEffect(() => {
    if (workDuration !== prevWorkDurationRef.current) {
      // Duration setting changed - reset timer if not active
      if (!isActive && mode === 'WORK') {
        setCurrentDuration(workDuration);
        setTimeLeft(workDuration);
      }
      prevWorkDurationRef.current = workDuration;
    }
  }, [workDuration, isActive, mode]);

  // Check Schedule Logic & Auto-Start
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = schedule.start.split(':').map(Number);
      const startMinutes = startH * 60 + startM;

      const [endH, endM] = schedule.end.split(':').map(Number);
      const endMinutes = endH * 60 + endM;

      const isNowOffDuty = currentMinutes < startMinutes || currentMinutes >= endMinutes;

      if (isNowOffDuty) {
        setIsOffDuty(true);
        setIsActive(false);
      } else {
        setIsOffDuty(false);
        // Auto-start if transitioning from Off Duty -> On Duty
        if (prevOffDutyRef.current === true) {
          setMode('WORK');
          setCurrentDuration(workDuration);
          setIsActive(true);
          if (window.electronAPI) {
            window.electronAPI.showNotification("Work Started", "Focus timer started automatically.");
          }
        }
      }
      prevOffDutyRef.current = isNowOffDuty;
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [schedule, workDuration]);



  // Check meal schedule and auto-start meal
  useEffect(() => {
    // Skip check if meal schedule is disabled
    if (!mealScheduleEnabled) return;

    const checkMealSchedule = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [mealStartH, mealStartM] = mealSchedule.start.split(':').map(Number);
      const mealStartMinutes = mealStartH * 60 + mealStartM;

      const [mealEndH, mealEndM] = mealSchedule.end.split(':').map(Number);
      const mealEndMinutes = mealEndH * 60 + mealEndM;

      const isNowMealTime = currentMinutes >= mealStartMinutes && currentMinutes < mealEndMinutes;

      if (isNowMealTime && mode !== 'MEAL' && !isOffDuty) {
        setMode('MEAL');
        setCurrentDuration(mealDuration);
        setIsActive(true);
        if (notificationsEnabled && window.electronAPI) {
          window.electronAPI.showNotification("Meal Time!", "Time for your meal break.");
        }
      }
    };

    checkMealSchedule();
    const interval = setInterval(checkMealSchedule, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [mealSchedule, mealDuration, mode, isOffDuty, permission, mealScheduleEnabled]);

  const requestNotification = () => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(setPermission);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);

    // Play sound
    playSound();

    // Pop window to front if enabled
    if (popToFrontEnabled && window.electronAPI) {
      window.electronAPI.focusWindow();
    }

    if (mode === 'WORK') {
      if (notificationsEnabled && window.electronAPI) {
        const body = upcomingExercise ? `Time for: ${upcomingExercise.name}` : "Select an exercise to get moving.";
        window.electronAPI.showNotification("Time to Move!", body);
      }
      // Go directly to pre-selected exercise or show selector
      if (upcomingExercise) {
        setCurrentExercise(upcomingExercise);
        setMode('EXERCISE');
      } else {
        setShowSelector(true);
      }
    } else if (mode === 'MEAL') {
      if (notificationsEnabled && window.electronAPI) {
        window.electronAPI.showNotification("Break Over", "Back to work! Focus timer starting.");
      }
      // Auto-restart Work
      setMode('WORK');
      setCurrentDuration(workDuration);
      setTimeLeft(workDuration);
      setIsActive(true);
    }
  };

  // Keep ref updated with latest handleTimerComplete
  useEffect(() => {
    handleTimerCompleteRef.current = handleTimerComplete;
  });

  const handleExerciseSelect = (exercise) => {
    setShowSelector(false);
    setMode('EXERCISE');
    setCurrentExercise(exercise);
  };

  const handleExerciseDone = () => {
    logExercise(); // Log the completed exercise
    setLastExerciseId(currentExercise.id || currentExercise.name); // Mark as done for rotation
    setCurrentExercise(null);
    setMode('WORK');
    setCurrentDuration(workDuration);
    setTimeLeft(workDuration);
    if (!isOffDuty) {
      setIsActive(true); // Auto-restart loop
    }
  };

  const toggleTimer = () => {
    requestNotification();
    setIsActive(!isActive);
  };

  const toggleMealMode = () => {
    if (mode !== 'MEAL') {
      setMode('MEAL');
      setCurrentDuration(mealDuration);
      setTimeLeft(mealDuration);
      setIsActive(true);
    } else {
      // Cancel Meal Mode -> Go back to Work (Paused)
      setMode('WORK');
      setCurrentDuration(workDuration);
      setTimeLeft(workDuration);
      setIsActive(false);
    }
  };

  const handleSaveSettings = (newWorkDuration, newSchedule, newMealDuration, newMealSchedule, newMealEnabled, newAudioSettings, newNotificationsEnabled, newPopToFrontEnabled) => {
    setWorkDuration(newWorkDuration);
    setSchedule(newSchedule);
    setMealDuration(newMealDuration);
    setMealSchedule(newMealSchedule);
    setMealScheduleEnabled(newMealEnabled);
    localStorage.setItem('mealScheduleEnabled', JSON.stringify(newMealEnabled));
    setNotificationsEnabled(newNotificationsEnabled);
    localStorage.setItem('notificationsEnabled', JSON.stringify(newNotificationsEnabled));
    setPopToFrontEnabled(newPopToFrontEnabled);
    localStorage.setItem('popToFrontEnabled', JSON.stringify(newPopToFrontEnabled));

    // Save Audio Settings
    if (newAudioSettings) {
      setSoundEnabled(newAudioSettings.enabled);
      setVolume(newAudioSettings.volume);
      setSoundType(newAudioSettings.soundType);
    }

    // Reset to reflect changes
    setIsActive(false);
    if (mode === 'WORK') setCurrentDuration(newWorkDuration);
    if (mode === 'MEAL') setCurrentDuration(newMealDuration);
  };

  // Status Text Helper
  const getStatusText = () => {
    if (isOffDuty) return "OFF DUTY";
    return null;
  }

  // --- Main Render ---
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--bg-color)', overflow: 'hidden' }}>

      {/* 1. Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* 2. Main Content Area */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* TIMER VIEW (Default) */}
        {activeView === 'TIMER' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', paddingTop: '4rem', position: 'relative', overflowY: 'auto' }}>

            {/* Header Controls (Meal Toggle) */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
              <button
                onClick={toggleMealMode}
                title="Meal Mode"
                style={{
                  background: mode === 'MEAL' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  minWidth: '130px',
                  justifyContent: 'center'
                }}
              >
                <span><Icons.Utensils /></span>
                {mode === 'MEAL' ? 'On Break' : 'Meal Mode'}
              </button>
            </div>

            {/* Sub-View: Selector */}
            {showSelector ? (
              <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
                <button
                  onClick={() => setShowSelector(false)}
                  style={{ marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  ← Back to Timer
                </button>
                <ExerciseSelector exercises={allExercises} onSelect={handleExerciseSelect} />
              </div>
            ) : currentExercise ? (
              // Sub-View: Exercise Card
              <ExerciseCard exercise={currentExercise} onDone={handleExerciseDone} />
            ) : (
              // Standard Timer
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '400px' }}>

                {/* Off Duty Overlay */}
                {isOffDuty ? (
                  <div className="status-overlay" style={{
                    width: '280px', height: '280px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <h2 style={{ fontSize: '2rem', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                      {getStatusText()}
                    </h2>
                  </div>
                ) : (
                  <>
                    {/* Timer Circle */}
                    <div style={{ position: 'relative', padding: '2rem' }}>
                      <Timer
                        timeLeft={timeLeft}
                        duration={currentDuration}
                        isActive={isActive}
                      />
                      {/* Glow Effect */}
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '300px', height: '300px', background: 'var(--primary-color)',
                        opacity: isActive ? 0.15 : 0.05, filter: 'blur(60px)', borderRadius: '50%', zIndex: -1,
                        transition: 'opacity 1s ease'
                      }} />
                    </div>

                    {/* Upcoming Preview */}
                    {mode === 'WORK' && upcomingExercise && (
                      <div style={{ marginTop: '-1rem' }}>
                        <ExercisePreview
                          exercise={upcomingExercise}
                          onChangeExercise={() => setActiveView('EXERCISES')}
                        />
                      </div>
                    )}
                  </>
                )}

                {!isOffDuty && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                      onClick={toggleTimer}
                      className={isActive ? '' : 'btn-primary'}
                      style={{
                        background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-color)',
                        color: isActive ? '#fca5a5' : 'white',
                        border: isActive ? '1px solid rgba(239, 68, 68, 0.2)' : 'none',
                        padding: '0.8rem 0',
                        borderRadius: '2rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isActive ? 'none' : '0 4px 12px rgba(94, 106, 210, 0.3)',
                        width: '140px',
                        textAlign: 'center'
                      }}
                    >
                      {isActive ? 'Pause' : (mode === 'MEAL' ? 'Start Meal' : 'Start Focus')}
                    </button>
                    <button
                      onClick={() => {
                        setIsActive(false);
                        setTimeLeft(currentDuration);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.8rem 0',
                        borderRadius: '2rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: '90px',
                        textAlign: 'center'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* EXERCISES VIEW */}
        {
          activeView === 'EXERCISES' && (
            <ExerciseManager
              allExercises={allExercises}
              customExercises={customExercises}
              onAdd={addExercise}
              onUpdate={updateExercise}
              onDelete={deleteExercise}
              onToggleEnabled={toggleExerciseEnabled}
              isExerciseEnabled={isExerciseEnabled}
              enabledCount={enabledExercises.length}
              totalCount={allExercises.length}
              onMoveUp={moveExerciseUp}
              onMoveDown={moveExerciseDown}
              onReorder={reorderExercises}
              onClose={() => { }} // No close needed
              isEmbedded={true}
            />
          )
        }

        {/* STATS VIEW */}
        {
          activeView === 'STATS' && (
            // We can use StatsModal components but rendered directly?
            // StatsModal is a modal wrapper. I should probably just render its content or accept embedded prop.
            // For now, let's wrap it in a pseudo-embedded container if it doesn't support it,
            // OR update StatsModal. I'll stick to a simple wrapper hack for now:
            // StatsModal expects "onClose". If I pass nothing, it might break?
            // Actually, StatsModal is simple. I'll just render it. A modal inside a main view is weird.
            // I will quickly peek StatsModal to see if I can embed it easily.
            // For now, I'll render the modal passing `onClose={() => setActiveView('TIMER')}` to allow "exit".
            <StatsModal
              stats={stats}
              onClose={() => setActiveView('TIMER')}
            />
          )
        }

        {/* SETTINGS VIEW */}
        {
          activeView === 'SETTINGS' && (
            <Settings
              currentDuration={workDuration}
              currentSchedule={schedule}
              currentMealDuration={mealDuration}
              currentMealSchedule={mealSchedule}
              mealScheduleEnabled={mealScheduleEnabled}
              audioSettings={{
                enabled: soundEnabled,
                volume,
                soundType,
                presets,
                addCustomSound,
                deleteCustomSound,
                playSound
              }}
              notificationsEnabled={notificationsEnabled}
              popToFrontEnabled={popToFrontEnabled}
              startupEnabled={startupEnabled}
              onToggleStartup={handleToggleStartup}
              onSave={handleSaveSettings}
              onClose={() => setActiveView('TIMER')} // "Save" or "Cancel" goes back to Timer
              isEmbedded={true}
            />
          )
        }

      </main >
    </div >
  );
}

export default App;
