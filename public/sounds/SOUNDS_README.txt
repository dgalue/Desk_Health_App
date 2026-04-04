Place in-app audio files in this directory.

These are played by useAudio.js via the Web Audio API (HTMLAudioElement) when the
timer completes and the app is in the foreground.

Required files:
  bell.wav    — Classic Bell (default sound)
  digital.wav — Crystal Beep
  nature.wav  — Forest Bird

All files must be:
  - Self-hosted (no remote CDN URLs) so they work offline and on Android WebView
  - Short duration (1–3 seconds)
  - WAV or MP3 format (WAV has broadest WebView compatibility)

Recommended source: https://mixkit.co/free-sound-effects/ (royalty-free)
