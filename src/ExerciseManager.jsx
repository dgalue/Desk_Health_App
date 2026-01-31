import React, { useState, useRef, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimation
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Safe Delete Button Component
const DeleteButton = ({ name, onDelete }) => {
    const [confirming, setConfirming] = React.useState(false);

    React.useEffect(() => {
        if (confirming) {
            const timer = setTimeout(() => setConfirming(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [confirming]);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

                if (confirming) {
                    onDelete();
                } else {
                    setConfirming(true);
                }
            }}
            style={{
                padding: '0.4rem 1.5rem',
                borderRadius: '0.5rem',
                background: confirming ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                color: confirming ? '#fca5a5' : '#ef4444',
                cursor: 'pointer',
                fontSize: '0.85rem',
                border: confirming ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(239, 68, 68, 0.2)',
                transition: 'all 0.2s ease',
                fontWeight: confirming ? 'bold' : 'normal',
                minWidth: '80px',
                fontFamily: 'inherit'
            }}
        >
            {confirming ? 'Confirm?' : 'Delete'}
        </button>
    );
};

// Pure Visual Component
const ExerciseItem = React.forwardRef(({ exercise, isExerciseEnabled, onToggleEnabled, onEdit, onDelete, highlightedId, dragHandleProps, style, isDragging, isOverlay }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                ...style,
                padding: '1rem',
                background: isOverlay ? 'var(--card-bg)' : (highlightedId === (exercise.id || exercise.name) ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-bg)'),
                borderRadius: '0.75rem',
                border: highlightedId === (exercise.id || exercise.name) ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: exercise.isCustom ? 'column' : 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                transition: isOverlay ? 'box-shadow 0.2s ease' : 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isOverlay
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
                    : (highlightedId === (exercise.id || exercise.name) ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none'),
                opacity: isDragging ? 0 : 1, // Hide original item completely while dragging
                cursor: isOverlay ? 'grabbing' : 'default',
                transform: isOverlay ? 'scale(1.02)' : 'none', // Slight pop effect
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, width: exercise.isCustom ? '100%' : 'auto' }}>
                {/* Drag Handle */}
                <div
                    {...dragHandleProps}
                    style={{
                        cursor: isOverlay ? 'grabbing' : 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem 0',
                        color: 'rgba(255,255,255,0.3)',
                        touchAction: 'none',
                        flexShrink: 0
                    }}
                    title="Drag to reorder"
                >
                    ⋮⋮
                </div>

                {/* Toggle Switch */}
                <div
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag start interference if any
                        if (onToggleEnabled) onToggleEnabled(exercise);
                    }}
                    style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        background: isExerciseEnabled && isExerciseEnabled(exercise)
                            ? 'var(--primary-color)'
                            : 'rgba(0,0,0,0.3)', // Darker background for OFF state
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        transform: isExerciseEnabled && isExerciseEnabled(exercise) ? 'translateX(20px)' : 'translateX(0)',
                        transition: 'transform 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', wordBreak: 'break-word', lineHeight: '1.2' }}>
                        {exercise.name}
                        {exercise.isCustom && (
                            <span style={{
                                display: 'inline-block',
                                marginLeft: '0.5rem',
                                fontSize: '0.7rem',
                                padding: '0.15rem 0.5rem',
                                background: 'rgba(56, 189, 248, 0.2)',
                                borderRadius: '0.25rem',
                                color: 'var(--primary-color)',
                                whiteSpace: 'nowrap',
                                verticalAlign: 'middle',
                                fontFamily: 'inherit'
                            }}>
                                CUSTOM
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem', wordBreak: 'break-word' }}>
                        {exercise.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>
                        {exercise.duration}
                    </div>
                </div>
            </div>

            {exercise.isCustom && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', width: '100%', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(exercise); }}
                        style={{
                            padding: '0.4rem 1.5rem',
                            borderRadius: '0.5rem',
                            background: 'rgba(129, 140, 248, 0.1)',
                            color: 'var(--secondary-color)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            border: '1px solid rgba(129, 140, 248, 0.2)',
                            fontFamily: 'inherit'
                        }}
                    >
                        Edit
                    </button>
                    {/* Safe Delete Button */}
                    <DeleteButton name={exercise.name} onDelete={() => onDelete(exercise.id)} />
                </div>
            )}
        </div>
    );
});

// Sortable Wrapper
const SortableItem = ({ id, exercise, isExerciseEnabled, onToggleEnabled, onEdit, onDelete, highlightedId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 5 : 1 // Keep relative z-index for list
    };

    return (
        <div ref={setNodeRef} style={style}>
            <ExerciseItem
                exercise={exercise}
                isExerciseEnabled={isExerciseEnabled}
                onToggleEnabled={onToggleEnabled}
                onEdit={onEdit}
                onDelete={onDelete}
                highlightedId={highlightedId}
                dragHandleProps={{ ...attributes, ...listeners }}
                isDragging={isDragging}
            />
        </div>
    );
};

const ExerciseManager = ({ allExercises, customExercises, onAdd, onUpdate, onDelete, onToggleEnabled, isExerciseEnabled, enabledCount, totalCount, onReorder, onClose, isEmbedded = false }) => {
    // State
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', durationValue: 30, durationUnit: 'seconds' });
    const [activeExercise, setActiveExercise] = useState(null);
    const [highlightedId, setHighlightedId] = useState(null);

    const formRef = useRef(null);
    const LIST_ID = 'exercise-list';

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const resetForm = () => {
        setFormData({ name: '', description: '', durationValue: 30, durationUnit: 'seconds' });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const duration = `${formData.durationValue} ${formData.durationUnit}`;

        if (editingId) {
            onUpdate(editingId, {
                name: formData.name,
                description: formData.description,
                duration
            });
        } else {
            onAdd({
                name: formData.name,
                description: formData.description,
                duration
            });
        }
        resetForm();
    };

    const handleEdit = (exercise) => {
        // Parse duration
        const [val, unit] = exercise.duration.split(' ');
        setFormData({
            name: exercise.name,
            description: exercise.description,
            durationValue: parseInt(val),
            durationUnit: unit || 'seconds'
        });
        setEditingId(exercise.id);
        setIsAdding(true);
        // Defer focus logic to effect
    };

    const handleCancel = () => {
        resetForm();
    };

    // De-selecting logic
    useEffect(() => {
        if (!isAdding) {
            setEditingId(null);
        }
    }, [isAdding]);

    const handleDeleteWrapper = (id) => {
        onDelete(id);
        if (editingId === id) {
            resetForm();
        }
    };

    // Drag Handlers
    const handleDragStart = (event) => {
        const { active } = event;
        const exercise = allExercises.find(ex => (ex.id || ex.name) === active.id);
        setActiveExercise(exercise);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = allExercises.findIndex(ex => (ex.id || ex.name) === active.id);
            const newIndex = allExercises.findIndex(ex => (ex.id || ex.name) === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Calculate the NEW ORDER array locally
                const newOrderIds = arrayMove(allExercises.map(ex => ex.id || ex.name), oldIndex, newIndex);
                // Pass the full array to the parent (which expects 'newOrder')
                onReorder(newOrderIds);
            }
        }
        setActiveExercise(null);
    };

    const handleDragCancel = () => {
        setActiveExercise(null);
    };

    // Auto-scroll to highlight
    useEffect(() => {
        if (highlightedId) {
            const timer = setTimeout(() => setHighlightedId(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [highlightedId]);

    // Input styles
    const commonInputStyle = {
        width: '100%',
        padding: '0.75rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '0.5rem',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontFamily: 'inherit', // Fix font mismatch
        marginTop: '0.25rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    // Stop propagation for inputs to prevent draggable interference
    const inputProps = {
        onPointerDown: (e) => e.stopPropagation(),
        onKeyDown: (e) => e.stopPropagation()
    };

    const containerStyle = isEmbedded ? {
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: '400px'
    } : {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, overflowY: 'auto',
        WebkitAppRegion: 'no-drag',
        userSelect: 'text',
    };

    const contentStyle = isEmbedded ? {
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-primary)'
    } : {
        background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem',
        border: '1px solid var(--glass-border)', width: '90%', maxWidth: '600px',
        maxHeight: '80vh', overflowY: 'auto',
        WebkitAppRegion: 'no-drag',
        cursor: 'default'
    };

    return (
        <div style={containerStyle}>
            <div
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                style={contentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    <h2>Manage Exercises</h2>
                    {!isEmbedded && <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>✕</button>}
                </div>

                {/* Add/Edit Form */}
                {isAdding ? (
                    <form ref={formRef} onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Exercise' : 'Add New Exercise'}</h3>
                        {/* Form Inputs */}
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Exercise Name</label>
                                <span style={{ fontSize: '0.8rem', color: formData.name.length >= 40 ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>{formData.name.length}/40</span>
                            </div>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                maxLength={40}
                                required
                                autoFocus
                                {...inputProps}
                                style={commonInputStyle}
                                placeholder="e.g. Neck Stretch"
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Instructions</label>
                                <span style={{ fontSize: '0.8rem', color: formData.description.length >= 100 ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>{formData.description.length}/100</span>
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                maxLength={100}
                                required
                                rows="3"
                                style={{ ...commonInputStyle, resize: 'none' }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder="Briefly describe the exercise..."
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Duration</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    value={formData.durationValue}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData({
                                            ...formData,
                                            durationValue: val === '' ? '' : parseInt(val)
                                        });
                                    }}
                                    min="1"
                                    max="999"
                                    required
                                    style={{ ...commonInputStyle, flex: 1 }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                                <select
                                    value={formData.durationUnit}
                                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                                    style={{ ...commonInputStyle, flex: 1, cursor: 'pointer' }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <option value="seconds">Seconds</option>
                                    <option value="minutes">Minutes</option>
                                    <option value="reps">Reps</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontWeight: 500
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid rgba(255,255,255,0.1)', // Light border for pop
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontFamily: 'inherit',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                {editingId ? 'Update Exercise' : 'Add Exercise'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '2px dashed var(--primary-color)',
                            background: 'rgba(56, 189, 248, 0.1)',
                            color: 'var(--primary-color)',
                            cursor: 'pointer',
                            marginBottom: '1.5rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            fontFamily: 'inherit'
                        }}
                    >
                        + Add New Exercise
                    </button>
                )}

                {/* Exercise List */}
                <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)' }}>
                        All Exercises ({allExercises.length}) • Enabled: {enabledCount}
                    </h3>

                    {/* DND Context */}
                    {!isAdding ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragCancel={handleDragCancel}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={allExercises.map(ex => ex.id || ex.name)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {allExercises.map((exercise) => (
                                        <SortableItem
                                            key={exercise.id || exercise.name}
                                            id={exercise.id || exercise.name}
                                            exercise={exercise}
                                            isExerciseEnabled={isExerciseEnabled}
                                            onToggleEnabled={onToggleEnabled}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteWrapper}
                                            highlightedId={highlightedId}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                            <DragOverlay>
                                {activeExercise ? (
                                    <ExerciseItem
                                        exercise={activeExercise}
                                        isExerciseEnabled={isExerciseEnabled}
                                        onToggleEnabled={null}
                                        onEdit={null}
                                        onDelete={null}
                                        highlightedId={highlightedId}
                                        dragHandleProps={{}}
                                        isOverlay
                                    />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.5, pointerEvents: 'none' }}>
                            {allExercises.map((exercise) => (
                                <ExerciseItem
                                    key={exercise.id || exercise.name}
                                    exercise={exercise}
                                    isExerciseEnabled={isExerciseEnabled}
                                    onToggleEnabled={null}
                                    onEdit={null}
                                    onDelete={null}
                                    highlightedId={highlightedId}
                                    dragHandleProps={{}}
                                    style={{ cursor: 'not-allowed' }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseManager;
