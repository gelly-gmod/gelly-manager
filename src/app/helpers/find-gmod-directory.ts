import path from "path";
import { locateSteamDir } from "@unlomtrois/steampath";
import parseLibraryFolders from "./parse-libraryfolders";
import * as fs from "node:fs";

export default async function findGModDirectory(): Promise<string | null> {
	const steamPath = await locateSteamDir();
	const libraryFoldersPath = path.join(
		steamPath,
		"steamapps",
		"libraryfolders.vdf",
	);

	const libraryFoldersContent = fs.readFileSync(libraryFoldersPath, "utf-8");
	if (!libraryFoldersContent) {
		return null;
	}

	const libraryFolders = parseLibraryFolders(libraryFoldersContent);
	const libraryContainingGMod = libraryFolders.find((library) =>
		library.gameIDs.includes("4000"),
	);

	if (libraryContainingGMod) {
		return path.join(
			libraryContainingGMod.path,
			"steamapps",
			"common",
			"GarrysMod",
		);
	}

	return null;
}
