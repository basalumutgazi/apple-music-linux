const { app, BrowserWindow, ipcMain } = require('electron');
const Player = require('mpris-service');

let mainWindow;
let mprisPlayer;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: __dirname + '/preload.js'
        },
        icon: 'icon.png',
        title: 'Apple Music'
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.webContents.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    mainWindow.loadURL('https://music.apple.com/tr/home/tr');

    // MPRIS player oluştur
    mprisPlayer = Player({
        name: 'applemusic',
        identity: 'Apple Music',
        supportedTypes: ['audio'],
        supportedUriSchemes: ['https'],
        supportedMimeTypes: ['audio/mpeg', 'audio/mp4'],
        supportedInterfaces: ['player']
    });

    // MPRIS komutlarını dinle
    mprisPlayer.on('playpause', () => {
        mainWindow.webContents.executeJavaScript(`
            document.querySelector('button.playback-play').click();
        `);
    });

    mprisPlayer.on('play', () => {
        mainWindow.webContents.executeJavaScript(`
            const btn = document.querySelector('button.playback-play');
            if (btn && btn.getAttribute('aria-label')?.includes('Play')) btn.click();
        `);
    });

    mprisPlayer.on('pause', () => {
        mainWindow.webContents.executeJavaScript(`
            const btn = document.querySelector('button.playback-play');
            if (btn && btn.getAttribute('aria-label')?.includes('Pause')) btn.click();
        `);
    });

    mprisPlayer.on('next', () => {
        mainWindow.webContents.executeJavaScript(`
            document.querySelector('button.playback-next').click();
        `);
    });

    mprisPlayer.on('previous', () => {
        mainWindow.webContents.executeJavaScript(`
            document.querySelector('button.playback-previous').click();
        `);
    });

    // Sayfa yüklenince şarkı bilgisini takip et
    mainWindow.webContents.on('did-finish-load', () => {
        startTrackingPlayback();
    });
}

function startTrackingPlayback() {
    setInterval(() => {
        mainWindow.webContents.executeJavaScript(`
            (function() {
                const title = document.querySelector('.lcd-meta__primary-wrapper')?.textContent || '';
                const artist = document.querySelector('.lcd-meta__secondary-wrapper')?.textContent || '';
                const isPlaying = document.querySelector('button.playback-play')?.getAttribute('aria-label')?.includes('Pause');
                return JSON.stringify({ title, artist, isPlaying });
            })()
        `).then(result => {
            try {
                const data = JSON.parse(result);
                if (data.title) {
                    mprisPlayer.metadata = {
                        'mpris:trackid': mprisPlayer.objectPath('track/0'),
                        'xesam:title': data.title,
                        'xesam:artist': [data.artist]
                    };
                    mprisPlayer.playbackStatus = data.isPlaying ? 'Playing' : 'Paused';
                }
            } catch (e) {}
        }).catch(() => {});
    }, 1000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
