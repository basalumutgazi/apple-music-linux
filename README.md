# Apple Music for Linux

Unofficial Apple Music client for Linux with Widevine DRM support. Not affiliated with Apple.

## Features

- Full song playback (not just preview)
- System media controls (MPRIS/playerctl)
- Works with keyboard media keys

## Installation

1. Clone the repo:
```
git clone https://github.com/basalumutgazi/apple-music-linux.git
cd apple-music-linux
```

2. Install dependencies:
```
npm install
```

3. Download Castlabs Electron (Widevine support):
```
wget https://github.com/castlabs/electron-releases/releases/download/v40.1.0%2Bwvcus/electron-v40.1.0+wvcus-linux-x64.zip
mkdir -p node_modules/electron/dist
unzip electron-v40.1.0+wvcus-linux-x64.zip -d node_modules/electron/dist/
```

4. Fix sandbox permissions:
```
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```

5. Run:
```
npm start
```

## Desktop Entry

Create `~/.local/share/applications/apple-music.desktop`:
```
[Desktop Entry]
Name=Apple Music
Exec=/path/to/apple-music-linux/node_modules/electron/dist/electron /path/to/apple-music-linux
Icon=/path/to/apple-music-linux/icon.svg
Type=Application
Categories=Audio;Music;Player;
```

## License

MIT
