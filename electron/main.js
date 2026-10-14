const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { fileURLToPath } = require("node:url");

let mainWindow = null;
const indexPath = path.resolve(__dirname, "..", "index.html");
const productionBuild = app.isPackaged;

app.enableSandbox();

function comparablePath(filePath) {
  const resolvedPath = path.resolve(filePath);
  return process.platform === "win32" ? resolvedPath.toLowerCase() : resolvedPath;
}

function isTrustedAppUrl(rawUrl) {
  try {
    const parsedUrl = new URL(rawUrl);
    return parsedUrl.protocol === "file:" && comparablePath(fileURLToPath(parsedUrl)) === comparablePath(indexPath);
  } catch (error) {
    return false;
  }
}

function assertTrustedSender(event) {
  const senderUrl = event.senderFrame ? event.senderFrame.url : event.sender.getURL();
  if (!isTrustedAppUrl(senderUrl)) {
    throw new Error("Request rejected from an untrusted page.");
  }
}

function installApplicationMenu() {
  if (!productionBuild) {
    return;
  }

  const template = [
    ...(process.platform === "darwin"
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
            ]
          }
        ]
      : [{ role: "fileMenu" }]),
    { role: "editMenu" },
    { role: "windowMenu" }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function isDeveloperToolsShortcut(input = {}) {
  const key = String(input.key || "").toLowerCase();
  const commandOrControl = Boolean(input.control || input.meta);
  return (
    key === "f12" ||
    (commandOrControl && input.shift && (key === "i" || key === "j" || key === "c"))
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 950,
    minWidth: 1100,
    minHeight: 720,
    title: `Astronomy Sub Analyser v${app.getVersion()}`,
    backgroundColor: "#eef2f4",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !productionBuild,
      backgroundThrottling: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    if (!isTrustedAppUrl(navigationUrl)) {
      event.preventDefault();
    }
  });
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (productionBuild && isDeveloperToolsShortcut(input)) {
      event.preventDefault();
    }
  });
  mainWindow.webContents.on("devtools-opened", () => {
    if (productionBuild) {
      mainWindow.webContents.closeDevTools();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadFile(indexPath);
}

function safeRelativePath(relativePath, fallbackName) {
  const parts = String(relativePath || "")
    .replace(/\\/g, "/")
    .split("/")
    .filter((part) => part && part !== "." && part !== "..");
  return parts.length > 0 ? parts.join(path.sep) : path.basename(fallbackName || "frame");
}

function pathIsInside(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}

ipcMain.handle("astro:choose-output-folder", async (event) => {
  assertTrustedSender(event);
  const parentWindow = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  const result = await dialog.showOpenDialog(parentWindow, {
    title: "Choose Output Folder",
    properties: ["openDirectory", "createDirectory"]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const folderPath = result.filePaths[0];
  return {
    path: folderPath,
    name: path.basename(folderPath) || folderPath
  };
});

ipcMain.handle("astro:copy-file", async (event, payload = {}) => {
  assertTrustedSender(event);
  const sourcePath = String(payload.sourcePath || "");
  const outputDirectoryPath = String(payload.outputDirectoryPath || "");
  if (!sourcePath || !outputDirectoryPath) {
    throw new Error("Missing source or output path.");
  }

  const outputRoot = path.resolve(outputDirectoryPath);
  const relativePath = safeRelativePath(payload.relativePath, path.basename(sourcePath));
  const targetPath = path.resolve(outputRoot, relativePath);
  if (!pathIsInside(outputRoot, targetPath)) {
    throw new Error("Refusing to copy outside the selected output folder.");
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(sourcePath, targetPath);
  return {
    path: targetPath
  };
});

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    installApplicationMenu();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
