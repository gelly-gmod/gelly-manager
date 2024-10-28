import parseLibraryFolders from "../parse-libraryfolders";
import { describe, expect, it } from "vitest";

const TEST_LIBRARY_FOLDERS = `
"libraryfolders"
{
\t"0"
\t{
\t\t"path"\t\t"C:\\\\Program Files (x86)\\\\Steam"
\t\t"label"\t\t"SSD"
\t\t"contentid"\t\t"5977801890234434734"
\t\t"totalsize"\t\t"0"
\t\t"update_clean_bytes_tally"\t\t"177874938"
\t\t"time_last_update_verified"\t\t"1729612433"
\t\t"apps"
\t\t{
\t\t\t"40"\t\t"48239254"
\t\t}
\t}
\t"1"
\t{
\t\t"path"\t\t"E:\\\\SteamLibrary"
\t\t"label"\t\t"SSD2"
\t\t"contentid"\t\t"6422563497070285475"
\t\t"totalsize"\t\t"500093153280"
\t\t"update_clean_bytes_tally"\t\t"2149514569"
\t\t"time_last_update_verified"\t\t"1730130962"
\t\t"apps"
\t\t{
\t\t\t"4000"\t\t"4394213372"
\t\t}
\t}
}
`;

describe("parseLibraryFolders", () => {
	it("should properly parse libraryfolders.vdf", () => {
		const result = parseLibraryFolders(TEST_LIBRARY_FOLDERS);

		expect(result).toEqual([
			{
				name: "SSD",
				path: "C:\\Program Files (x86)\\Steam",
				gameIDs: ["40"],
			},
			{
				name: "SSD2",
				path: "E:\\SteamLibrary",
				gameIDs: ["4000"],
			},
		]);
	});
});
