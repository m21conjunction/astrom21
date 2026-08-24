const { contextBridge, ipcRenderer, webUtils } = require("electron");
const os = require("node:os");

contextBridge.exposeInMainWorld("astroDesktop", {
  isDesktop: true,
  systemResources: () => ({
    logicalCores: os.cpus().length,
    totalMemoryGb: os.totalmem() / (1024 * 1024 * 1024)
  }),
  getPathForFile: (file) => webUtils.getPathForFile(file),
  chooseOutputFolder: () => ipcRenderer.invoke("astro:choose-output-folder"),
  copyFile: ({ sourcePath, outputDirectoryPath, relativePath }) =>
    ipcRenderer.invoke("astro:copy-file", {
      sourcePath,
      outputDirectoryPath,
      relativePath
    })
});
