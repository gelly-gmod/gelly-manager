import { app, BrowserWindow, ipcMain, shell, nativeTheme } from "electron";

import path from "path";
import getLatestGithubRelease from "./app/helpers/get-latest-github-release";
import findCurrentlyInstalledRelease from "./app/find-currently-installed-release";
import installRelease from "./app/install";
import uninstallRelease from "./app/uninstall";

const OPEN_GMOD_SHELL_COMMAND = "steam://rungameid/4000";
const BACKGROUND_COLORS = {
	light: {
		modal: {
			color: "#696969",
			symbolColor: "#000",
		},
		nomodal: {
			color: "#d2d2d2",
			symbolColor: "#000",
		},
	},
	dark: {
		modal: {
			color: "#080000",
			symbolColor: "#fff",
		},
		nomodal: {
			color: "#110000",
			symbolColor: "#fff",
		},
	},
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,

		title: "Gelly Manager",
		icon: path.join(process.cwd(), "gelly_manager_logo.ico"),

		frame: true,
		titleBarStyle: "hidden",
		titleBarOverlay: nativeTheme.shouldUseDarkColors
			? BACKGROUND_COLORS.dark.nomodal
			: BACKGROUND_COLORS.light.nomodal,
		resizable: true,
		darkTheme: false,
		backgroundColor: nativeTheme.shouldUseDarkColors
			? BACKGROUND_COLORS.dark.nomodal.color
			: BACKGROUND_COLORS.light.nomodal.color,

		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(
			path.join(
				__dirname,
				`../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
			),
		);
	}

	ipcMain.handle("get-latest-release", async (_) => {
		return await getLatestGithubRelease();
	});

	ipcMain.handle("get-current-release", async (_) => {
		return await findCurrentlyInstalledRelease();
	});

	ipcMain.handle("install", async (_, release) => {
		try {
			await installRelease(release);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	});

	ipcMain.handle("uninstall", async () => {
		try {
			await uninstallRelease();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	});

	ipcMain.handle("run-gmod", async () => {
		await shell.openExternal(OPEN_GMOD_SHELL_COMMAND);
	});

	ipcMain.handle("update-title-bar-buttons-on-modal-open", async () => {
		mainWindow.setTitleBarOverlay(
			nativeTheme.shouldUseDarkColors
				? BACKGROUND_COLORS.dark.modal
				: BACKGROUND_COLORS.light.modal,
		);
	});

	ipcMain.handle("update-title-bar-buttons-on-modal-close", async () => {
		mainWindow.setTitleBarOverlay(
			nativeTheme.shouldUseDarkColors
				? BACKGROUND_COLORS.dark.nomodal
				: BACKGROUND_COLORS.light.nomoda,
		);
	});

	nativeTheme.on("updated", () => {
		mainWindow.setBackgroundColor(
			nativeTheme.shouldUseDarkColors
				? BACKGROUND_COLORS.dark.nomodal.color
				: BACKGROUND_COLORS.light.nomodal.color,
		);

		mainWindow.setTitleBarOverlay(
			nativeTheme.shouldUseDarkColors
				? BACKGROUND_COLORS.dark.nomodal
				: BACKGROUND_COLORS.light.nomodal,
		);
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
