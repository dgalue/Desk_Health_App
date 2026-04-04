Place notification sound files in this directory.

@capacitor/local-notifications looks for sounds here by filename (without extension).

Required file:
  beep.wav   — short alert sound played when a notification is delivered

Specifications:
  - Format: WAV or OGG (OGG preferred for smaller size; WAV is universally supported)
  - Duration: 1–3 seconds
  - Referenced in capacitor.config.json as: "sound": "beep.wav"
  - Referenced in the channel definition in App.jsx as: sound: 'beep.wav'

You can use any royalty-free short alert sound. Rename it to beep.wav (or beep.ogg) and place it here.
