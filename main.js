const { app, BrowserWindow, ipcMain, Tray, globalShortcut } = require('electron')
const path = require('path')

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

// Don't show the app in the doc
app.dock.hide()

app.on('ready', () => {
    createTray()
    createWindow()
})

//Hotkey configurations for accessing QuickClips etc...
app.whenReady().then(() => {
    globalShortcut.register('Control+X', () => {
        window.show();
    })
    globalShortcut.register('Control+C', () => {
        window.hide();
    })
    globalShortcut.register('Esc', () => {
        app.quit();
    })
    globalShortcut.register('Control+0', () => {
        window.open('/Users/szilard.szarvas/Desktop/ClipBoard[Tray]/teszt.html', '_blank', 'nodeIntegration=no')
    })
    globalShortcut.register('Command+G', () => {
        const win = new BrowserWindow
        win.window.open('/Users/szilard.szarvas/Desktop/electronjs/electron-quick-start/PasteContainer.html')
    })
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
    app.quit()
})

const createTray = () => {
    tray = new Tray(path.join(assetsDirectory, 'sunTemplate.png'))
    tray.on('right-click', toggleWindow)
    tray.on('double-click', toggleWindow)
    tray.on('click', function(event) {
        toggleWindow()

        // Show devtools when command clicked
        if (window.isVisible() && process.defaultApp && event.metaKey) {
            window.openDevTools({ mode: 'detach' })
        }
    })
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}


const createWindow = () => {
    window = new BrowserWindow({
        width: 300,
        height: 500,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: true,
        transparent: true,
        webPreferences: {
            // Prevents renderer process code from not running when window is
            // hidden
            backgroundThrottling: false
        }
    })
    window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

    // Hide the window when it loses focus
    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide()
        }
    })
}

const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide()
    } else {
        showWindow()
    }
}

const showWindow = () => {
    const position = getWindowPosition()
    window.setPosition(position.x, position.y, false)
    window.show()
    window.focus()
}


ipcMain.on('weather-updated', (event, weather) => {
    // Show "feels like" temperature in tray
    tray.setTitle(`${Math.round(weather.currently.apparentTemperature)}°`)

    // Show summary and last refresh time as hover tooltip
    const time = new Date(weather.currently.time).toLocaleTimeString()
    tray.setToolTip(`${weather.currently.summary} at ${time}`)

})