// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

export const GellyBridge = {
	getCurrentRelease: async () => ipcRenderer.invoke("get-current-release"),
	getLatestRelease: async () => ipcRenderer.invoke("get-latest-release"),
	install: async (release: object) => ipcRenderer.invoke("install", release),
	uninstall: async () => ipcRenderer.invoke("uninstall"),
	runGMod: async () => ipcRenderer.invoke("run-gmod"),
	updateTitleBarButtonsOnModalOpen: async () =>
		ipcRenderer.invoke("update-title-bar-buttons-on-modal-open"),
	updateTitleBarButtonsOnModalClose: async () =>
		ipcRenderer.invoke("update-title-bar-buttons-on-modal-close"),
};

contextBridge.exposeInMainWorld("GellyBridge", GellyBridge);
