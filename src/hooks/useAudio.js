import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEYS = {
    ENABLED: 'deskHealth_soundEnabled',
    VOLUME: 'deskHealth_soundVolume',
    TYPE: 'deskHealth_soundType'
};

const SOUND_PRESETS = {
    bell: {
        id: 'bell',
        name: 'Classic Bell',
        url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
    },
    digital: {
        id: 'digital',
        name: 'Crystal Beep',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/glass.mp3'
    },
    nature: {
        id: 'nature',
        name: 'Forest Bird',
        url: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3'
    }
};

export const useAudio = () => {
    // State initialization with localStorage fallback
    const [enabled, setEnabled] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.ENABLED);
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
        return saved !== null ? Number(saved) : 0.5;
    });

    // Custom Sounds State
    const [customPresets, setCustomPresets] = useState(() => {
        const saved = localStorage.getItem('deskHealth_customSounds');
        return saved ? JSON.parse(saved) : [];
    });

    const allPresets = [...Object.values(SOUND_PRESETS), ...customPresets];

    const [soundType, setSoundType] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.TYPE);
        // Check if saved type exists in defaults or custom
        const exists = allPresets.find(p => p.id === saved);
        return exists ? saved : 'bell';
    });

    const audioRef = useRef(null);

    // Persist changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.ENABLED, JSON.stringify(enabled));
    }, [enabled]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VOLUME, volume);
    }, [volume]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.TYPE, soundType);
    }, [soundType]);

    const addCustomSound = useCallback((name, url) => {
        const newPreset = {
            id: `custom_${Date.now()}`,
            name,
            url,
            isCustom: true
        };

        setCustomPresets(prev => {
            const updated = [...prev, newPreset];
            localStorage.setItem('deskHealth_customSounds', JSON.stringify(updated));
            return updated;
        });

        setSoundType(newPreset.id); // Auto-select new sound
    }, []);

    const deleteCustomSound = useCallback((id) => {
        setCustomPresets(prev => {
            const updated = prev.filter(p => p.id !== id);
            localStorage.setItem('deskHealth_customSounds', JSON.stringify(updated));
            return updated;
        });
        if (soundType === id) setSoundType('bell'); // Reset if deleted current
    }, [soundType]);

    // Play function
    const playSound = useCallback((options = {}) => {
        if (!enabled && !options.force) return;

        const typeToPlay = options.type || soundType;
        // Find preset in combined list
        const preset = allPresets.find(p => p.id === typeToPlay);

        if (!preset) return;

        // Stop current if playing (optional, depending on desired overlap behavior)
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio(preset.url);
        audio.volume = options.volume !== undefined ? options.volume : volume;
        audioRef.current = audio;

        audio.play().catch(error => {
            console.warn('Audio playback failed:', error);
        });
    }, [enabled, volume, soundType, customPresets]);

    return {
        enabled,
        setEnabled,
        volume,
        setVolume,
        soundType,
        setSoundType,
        playSound,
        presets: allPresets,
        addCustomSound,
        deleteCustomSound
    };
};
