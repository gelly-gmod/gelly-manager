import findGModDirectory from "./helpers/find-gmod-directory";
import * as fs from "node:fs/promises";

const RELATIVE_PATHS_FOR_DELETION = [
	"garrysmod/addons/gelly",
	"garrysmod/lua/bin/gmcl_gelly-gmod_win64.dll",
];

export default async function uninstallRelease(): Promise<void> {
	const gmodDirectory = await findGModDirectory();
	if (!gmodDirectory) {
		throw new Error("Garry's Mod directory not found");
	}

	const deletePromises = RELATIVE_PATHS_FOR_DELETION.map((relativePath) => {
		return fs.rm(`${gmodDirectory}/${relativePath}`, {
			recursive: true,
			force: true,
		});
	});

	await Promise.all(deletePromises);
}
