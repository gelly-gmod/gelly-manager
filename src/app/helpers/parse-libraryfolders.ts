import * as VDF from "vdf-parser";

export type RawFormat = {
	libraryfolders: Record<
		string,
		{
			label: string;
			path: string;
			apps: Record<string, string>;
		}
	>;
};

export type LibraryFolders = {
	name: string;
	path: string;
	gameIDs: string[];
}[];

function parseRawLibraryFolders(libraryFoldersContent: string): RawFormat {
	const parsed = <RawFormat>VDF.parse(libraryFoldersContent);

	if (!parsed.libraryfolders) {
		throw new Error("Invalid libraryfolders.vdf");
	}

	return parsed;
}

export default function parseLibraryFolders(
	libraryFoldersContent: string,
): LibraryFolders {
	const raw = parseRawLibraryFolders(libraryFoldersContent);
	const libraryFolders: LibraryFolders = [];

	for (const data of Object.values(raw.libraryfolders)) {
		libraryFolders.push({
			name: data.label,
			path: data.path.replaceAll("\\\\", "\\"),
			gameIDs: Object.keys(data.apps),
		});
	}

	return libraryFolders;
}
