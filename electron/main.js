const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 950,
    minWidth: 1100,
    minHeight: 720,
    title: "Astronomy Sub Analyser v0.2.0",
    backgroundColor: "#eef2f4",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));
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
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

ipcMain.handle("astro:choose-output-folder", async (event) => {
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

ipcMain.handle("astro:copy-file", async (_event, payload = {}) => {
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

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
