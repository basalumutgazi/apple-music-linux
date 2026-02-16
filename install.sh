#!/bin/bash
set -e

echo "🎵 Apple Music Linux Installer"

# Check dependencies
if ! command -v npm &> /dev/null; then
    echo "npm not found. Please install Node.js first."
    exit 1
fi

# Create directory
INSTALL_DIR="$HOME/.local/share/apple-music-linux"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Clone repo
if [ -d ".git" ]; then
    git pull
else
    git clone https://github.com/basalumutgazi/apple-music-linux.git .
fi

# Install dependencies
npm install

# Download Castlabs Electron with Widevine support
echo "Downloading Widevine-enabled Electron..."
wget -q https://github.com/castlabs/electron-releases/releases/download/v40.1.0%2Bwvcus/electron-v40.1.0+wvcus-linux-x64.zip
mkdir -p node_modules/electron/dist
unzip -o electron-v40.1.0+wvcus-linux-x64.zip -d node_modules/electron/dist/
rm electron-v40.1.0+wvcus-linux-x64.zip

# Set sandbox permissions
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

# Create desktop entry
cat > "$HOME/.local/share/applications/apple-music.desktop" << EOF
[Desktop Entry]
Name=Apple Music
Exec=$INSTALL_DIR/node_modules/electron/dist/electron $INSTALL_DIR
Icon=$INSTALL_DIR/icon.svg
Type=Application
Categories=Audio;Music;Player;
EOF

echo "✅ Installation complete! Search for 'Apple Music' in your app menu."
