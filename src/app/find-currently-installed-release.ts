import findGModDirectory from "./helpers/find-gmod-directory";
import * as fs from "node:fs";
import versionInfo from "win-version-info";

export type InstalledReleaseInfo = {
	version: string | null;
	hasBothGMAAndLua: boolean;
};

const REQUIRED_FILES_AND_FOLDERS = [
	"garrysmod/addons/gelly",
	"garrysmod/lua/bin/gmcl_gelly-gmod_win64.dll",
];

export default async function findCurrentlyInstalledRelease(): Promise<InstalledReleaseInfo | null> {
	const gmodPath = await findGModDirectory();

	for (const fileOrFolder of REQUIRED_FILES_AND_FOLDERS) {
		const fullPath = `${gmodPath}/${fileOrFolder}`;
		const exists = fs.existsSync(fullPath);

		if (!exists) {
			return null;
		}
	}

	const binaryPath = `${gmodPath}/garrysmod/lua/bin/gmcl_gelly-gmod_win64.dll`;
	const versionInformation = versionInfo(binaryPath);

	const version = versionInformation.FileVersion.substring(-2); // trims the extra .0 from x.xx.x.// 0

	// A major regression was introduced a while ago which causes subtle corruption in the addon
	// if both lua and the GMA file are present. This is a workaround to detect this issue. The manager
	// will offer to fix the issue by removing the GMA file if it is detected.
	const hasBothGMAAndLua =
		fs.existsSync(`${gmodPath}/garrysmod/addons/gelly/gelly.gma`) &&
		fs.existsSync(`${gmodPath}/garrysmod/addons/gelly/lua`);

	return { version, hasBothGMAAndLua };
}
