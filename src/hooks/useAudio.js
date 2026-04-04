import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const STORAGE_KEYS = {
    ENABLED: 'deskHealth_soundEnabled',
    VOLUME: 'deskHealth_soundVolume',
    TYPE: 'deskHealth_soundType'
};

// Sound URLs are relative to the public/ folder so they are bundled with the app.
// Remote CDN URLs are avoided because:
//  1. Android WebView blocks cross-origin audio autoplay from remote origins.
//  2. The app must work offline.
//  3. audio.play() requires a user-gesture unlock on Android — we handle that below.
const SOUND_PRESETS = {
    bell: {
        id: 'bell',
        name: 'Classic Bell',
        url: 'sounds/bell.wav'
    },
    digital: {
        id: 'digital',
        name: 'Crystal Beep',
        url: 'sounds/digital.wav'
    },
    nature: {
        id: 'nature',
        name: 'Forest Bird',
        url: 'sounds/nature.wav'
    }
};

export const useAudio = () => {
    const [enabled, setEnabled] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.ENABLED);
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
        return saved !== null ? Number(saved) : 0.5;
    });

    const [customPresets, setCustomPresets] = useState(() => {
        const saved = localStorage.getItem('deskHealth_customSounds');
        return saved ? JSON.parse(saved) : [];
    });

    const allPresets = useMemo(
        () => [...Object.values(SOUND_PRESETS), ...customPresets],
        [customPresets]
    );

    const [soundType, setSoundType] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.TYPE);
        const exists = allPresets.find(p => p.id === saved);
        return exists ? saved : 'bell';
    });

    const audioRef = useRef(null);

    // Android WebView requires the AudioContext (and HTMLAudioElement) to be unlocked
    // by a real user gesture. We create and immediately suspend a silent AudioContext
    // on the first user interaction so subsequent programmatic plays work without a gesture.
    const audioContextUnlockedRef = useRef(false);
    useEffect(() => {
        const unlock = () => {
            if (audioContextUnlockedRef.current) return;
            audioContextUnlockedRef.current = true;

            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                // Play a silent buffer to satisfy the autoplay policy.
                const buf = ctx.createBuffer(1, 1, 22050);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                src.connect(ctx.destination);
                src.start(0);
                ctx.suspend();
            } catch (_) {
                // AudioContext not available; playback will fall back to HTMLAudioElement.
            }

            // Remove listeners once unlocked.
            document.removeEventListener('touchstart', unlock, true);
            document.removeEventListener('touchend', unlock, true);
            document.removeEventListener('click', unlock, true);
        };

        document.addEventListener('touchstart', unlock, true);
        document.addEventListener('touchend', unlock, true);
        document.addEventListener('click', unlock, true);

        return () => {
            document.removeEventListener('touchstart', unlock, true);
            document.removeEventListener('touchend', unlock, true);
            document.removeEventListener('click', unlock, true);
        };
    }, []);

    // Persist state changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.ENABLED, JSON.stringify(enabled));
    }, [enabled]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VOLUME, volume);
    }, [volume]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.TYPE, soundType);
    }, [soundType]);

    const addCustomSound = useCallback(async (name, dataUrl) => {
        let url = dataUrl;

        // In Electron: persist to disk to avoid filling localStorage with base64 blobs
        if (window.electronAPI?.saveSoundFile) {
            try {
                const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.mp3`;
                url = await window.electronAPI.saveSoundFile(filename, dataUrl);
            } catch (e) {
                console.warn('[DeskHealth] Failed to save sound file to disk, using base64 fallback:', e);
            }
        }

        const newPreset = {
            id: `custom_${Date.now()}`,
            name,
            url,
            isCustom: true
        };

        setCustomPresets(prev => {
            const updated = [...prev, newPreset];
            // Only store metadata (url + name) in localStorage, not raw base64
            const metaOnly = updated.map(({ id, name, url, isCustom }) => ({ id, name, url, isCustom }));
            localStorage.setItem('deskHealth_customSounds', JSON.stringify(metaOnly));
            return updated;
        });

        setSoundType(newPreset.id);
    }, []);

    const deleteCustomSound = useCallback((id) => {
        setCustomPresets(prev => {
            const toDelete = prev.find(p => p.id === id);
            // In Electron: clean up the file from disk
            if (toDelete && window.electronAPI?.deleteSoundFile) {
                const filename = toDelete.url.split('/').pop();
                window.electronAPI.deleteSoundFile(filename).catch(() => {});
            }
            const updated = prev.filter(p => p.id !== id);
            localStorage.setItem('deskHealth_customSounds', JSON.stringify(updated));
            return updated;
        });
        if (soundType === id) setSoundType('bell');
    }, [soundType]);

    const playSound = useCallback((options = {}) => {
        if (!enabled && !options.force) return;

        const typeToPlay = options.type || soundType;
        const preset = allPresets.find(p => p.id === typeToPlay);

        if (!preset) return;

        // Stop previous playback
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio(preset.url);
        audio.volume = options.volume !== undefined ? options.volume : volume;
        audioRef.current = audio;

        audio.play().catch(error => {
            // NotAllowedError means the autoplay policy blocked us (no prior user gesture).
            // This is expected if the timer fires while the app is backgrounded on Android.
            // The Capacitor LocalNotifications sound attribute handles audio in that scenario.
            console.warn('[DeskHealth] Audio playback blocked:', error.name, error.message);
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
