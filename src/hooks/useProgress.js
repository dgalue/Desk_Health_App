import { useState, useEffect, useMemo, useCallback } from 'react';

const STORAGE_KEY = 'deskHealthv1_progress';

export const useProgress = () => {
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    // Persist logs whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }, [logs]);

    const getTodayKey = () => new Date().toISOString().split('T')[0];

    // Helper to get or create today's log
    const getTodayLog = useCallback(() => {
        const key = getTodayKey();
        return {
            key,
            exercisesCompleted: 0,
            minutesFocused: 0,
            ...logs[key]
        };
    }, [logs]);

    const logExercise = useCallback(() => {
        const key = getTodayKey();
        setLogs(prev => {
            const current = prev[key] || { exercisesCompleted: 0, minutesFocused: 0 };
            return {
                ...prev,
                [key]: {
                    ...current,
                    exercisesCompleted: current.exercisesCompleted + 1
                }
            };
        });
    }, []);

    const logFocusTime = useCallback((minutes) => {
        const key = getTodayKey();
        setLogs(prev => {
            const current = prev[key] || { exercisesCompleted: 0, minutesFocused: 0 };
            return {
                ...prev,
                [key]: {
                    ...current,
                    minutesFocused: current.minutesFocused + minutes
                }
            };
        });
    }, []);

    const stats = useMemo(() => {
        const todayKey = getTodayKey();
        const todayLog = getTodayLog();

        // Calculate streaks
        const sortedDates = Object.keys(logs).sort();
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        // Iterate through dates to calculate streaks
        // A "streak day" is defined as >= 1 exercise OR >= 60 mins focus
        const isStreakDay = (dateKey) => {
            const log = logs[dateKey];
            if (!log) return false;
            return log.exercisesCompleted >= 1 || log.minutesFocused >= 60;
        };

        // Check if today counts yet
        const todayIsStreak = isStreakDay(todayKey);

        // Backtrack from yesterday for current streak
        let checkDate = new Date();
        if (!todayIsStreak) {
            checkDate.setDate(checkDate.getDate() - 1); // Start checking from yesterday
        }

        // Simple streak calculation (consecutive days)
        // Note: Real-world logic allows skipping weekends etc, but we'll stick to strict daily for now
        // Or actually, let's just count consecutive days present in logs that meet criteria
        // This handles gaps appropriately by breaking the streak

        // Robust calculation:
        // 1. Convert all valid streak dates to timestamps
        const validDates = sortedDates
            .filter(isStreakDay)
            .map(d => new Date(d).setHours(0, 0, 0, 0))
            .sort((a, b) => a - b);

        if (validDates.length > 0) {
            let currentSequence = 1;
            let maxSequence = 1;

            for (let i = 1; i < validDates.length; i++) {
                const diffTime = Math.abs(validDates[i] - validDates[i - 1]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentSequence++;
                } else {
                    maxSequence = Math.max(maxSequence, currentSequence);
                    currentSequence = 1;
                }
            }
            maxSequence = Math.max(maxSequence, currentSequence);
            bestStreak = maxSequence;

            // Determine if current streak is active
            const lastValidDate = validDates[validDates.length - 1];
            const todayTs = new Date(todayKey).setHours(0, 0, 0, 0);
            const yesterdayTs = new Date(todayTs - 86400000).setHours(0, 0, 0, 0);

            if (lastValidDate === todayTs || lastValidDate === yesterdayTs) {
                currentStreak = currentSequence;
            } else {
                currentStreak = 0;
            }
        }

        return {
            today: todayLog,
            currentStreak,
            bestStreak,
            history: logs
        };
    }, [logs, getTodayLog]);

    return {
        logExercise,
        logFocusTime,
        stats
    };
};
