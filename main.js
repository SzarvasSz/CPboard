const { app, BrowserWindow, globalShortcut} = require('electron')
const clipboard = require('electron-clipboard-extended')

const path = require('path')
const assetsDirectory = path.join(__dirname, 'index.css')

// Don't show the app in the doc
app.dock.hide()

app.on('ready', () => {
    createWindow()
    clipboard.startWatching()
})

clipboard.on('text-changed', () => {
    let currentText = clipboard.readText()
    console.log(currentText)
})
//Hotkey configurations for accessing QuickClips etc...
app.whenReady().then(() => {
    globalShortcut.register('Control+X', () => {
        var a = window.isVisible()
        if(a == false) {
        window.show()
        }
        else {
        window.hide()
        }
    })
    globalShortcut.register('Command+X', () => {
        var a = clipboard.readText()
        console.log(a)
    })
    globalShortcut.register('Esc', () => {
        app.quit();
    })
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
    app.quit()
})

const createWindow = () => {
    window = new BrowserWindow({
        width: 1200,
        height: 600,
        show: true,
        frame: true,
        fullscreenable: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            // Prevents renderer process code from not running when window is
            // hidden
            backgroundThrottling: true,
        }
    })
    window.loadURL(`file://${__dirname}/views/index.html`)
    window.webContents.on('did-finish-load', () => {
    window.webContents.send('ping', clipboard.readText())
    })
}

const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide()
    } else {
        showWindow()
    }
}
