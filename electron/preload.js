const { contextBridge, ipcRenderer, webUtils } = require("electron");

function systemResources() {
  const logicalCores = Math.max(1, Number(navigator.hardwareConcurrency) || 1);
  try {
    const memory = process.getSystemMemoryInfo();
    return {
      logicalCores,
      totalMemoryGb: memory.total / (1024 * 1024)
    };
  } catch (error) {
    return { logicalCores };
  }
}

contextBridge.exposeInMainWorld("astroDesktop", {
  isDesktop: true,
  systemResources,
  getPathForFile: (file) => webUtils.getPathForFile(file),
  chooseOutputFolder: () => ipcRenderer.invoke("astro:choose-output-folder"),
  copyFile: ({ sourcePath, outputDirectoryPath, relativePath } = {}) =>
    ipcRenderer.invoke("astro:copy-file", {
      sourcePath,
      outputDirectoryPath,
      relativePath
    })
});
