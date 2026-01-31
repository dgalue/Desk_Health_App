import { useState, useEffect, useMemo } from 'react';
import { exercises as defaultExercises } from '../exercises';

export const useExercises = () => {
    const [customExercises, setCustomExercises] = useState([]);
    const [exerciseStates, setExerciseStates] = useState({});
    const [exerciseOrder, setExerciseOrder] = useState([]);

    // Load custom exercises from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('customExercises');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setCustomExercises(parsed);
            } catch (e) {
                console.error('Error loading custom exercises:', e);
            }
        }
    }, []);

    // Load exercise states (enabled/disabled) from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('exerciseStates');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setExerciseStates(parsed);
            } catch (e) {
                console.error('Error loading exercise states:', e);
            }
        }
    }, []);

    // Load exercise order from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('exerciseOrder');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setExerciseOrder(parsed);
            } catch (e) {
                console.error('Error loading exercise order:', e);
            }
        }
    }, []);

    // Get exercise ID (custom exercises have id, default ones use name)
    const getExerciseId = (exercise) => exercise.id || exercise.name;

    // Merge and order exercises
    const allExercises = useMemo(() => {
        const merged = [...defaultExercises, ...customExercises];

        // If we have a custom order, apply it
        if (exerciseOrder.length > 0) {
            const ordered = [];
            const exerciseMap = new Map(merged.map(ex => [getExerciseId(ex), ex]));

            // Add exercises in the saved order
            exerciseOrder.forEach(id => {
                if (exerciseMap.has(id)) {
                    ordered.push(exerciseMap.get(id));
                    exerciseMap.delete(id);
                }
            });

            // Add any new exercises that weren't in the saved order
            exerciseMap.forEach(ex => ordered.push(ex));

            return ordered;
        }
        return merged;
    }, [customExercises, exerciseOrder]);

    // Check if exercise is enabled (default: true)
    const isExerciseEnabled = (exercise) => {
        const id = getExerciseId(exercise);
        return exerciseStates[id] !== false; // default to enabled
    };

    // Filter to only enabled exercises
    const enabledExercises = allExercises.filter(isExerciseEnabled);

    const addExercise = (exercise) => {
        const newExercise = {
            ...exercise,
            id: Date.now().toString(),
            isCustom: true
        };
        const updated = [...customExercises, newExercise];
        setCustomExercises(updated);
        localStorage.setItem('customExercises', JSON.stringify(updated));
    };

    const updateExercise = (id, updates) => {
        const updated = customExercises.map(ex =>
            ex.id === id ? { ...ex, ...updates } : ex
        );
        setCustomExercises(updated);
        localStorage.setItem('customExercises', JSON.stringify(updated));
    };

    const deleteExercise = (id) => {
        const updated = customExercises.filter(ex => ex.id !== id);
        setCustomExercises(updated);
        localStorage.setItem('customExercises', JSON.stringify(updated));

        // Also remove from order
        const newOrder = exerciseOrder.filter(orderId => orderId !== id);
        setExerciseOrder(newOrder);
        localStorage.setItem('exerciseOrder', JSON.stringify(newOrder));
    };

    const toggleExerciseEnabled = (exercise) => {
        const id = getExerciseId(exercise);
        const newStates = {
            ...exerciseStates,
            [id]: !isExerciseEnabled(exercise)
        };
        setExerciseStates(newStates);
        localStorage.setItem('exerciseStates', JSON.stringify(newStates));
    };

    const moveExercise = (fromIndex, toIndex) => {
        const newOrder = allExercises.map(getExerciseId);
        const [moved] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, moved);

        setExerciseOrder(newOrder);
        localStorage.setItem('exerciseOrder', JSON.stringify(newOrder));
    };

    const moveExerciseUp = (index) => {
        if (index > 0) {
            moveExercise(index, index - 1);
        }
    };

    const moveExerciseDown = (index) => {
        if (index < allExercises.length - 1) {
            moveExercise(index, index + 1);
        }
    };

    const reorderExercises = (newOrder) => {
        // newOrder expected to be Array of exercise IDs
        setExerciseOrder(newOrder);
        localStorage.setItem('exerciseOrder', JSON.stringify(newOrder));
    };

    return {
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
    };
};
