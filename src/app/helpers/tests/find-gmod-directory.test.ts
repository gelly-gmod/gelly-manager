import findGModDirectory from "../find-gmod-directory";
import { describe, it, beforeAll, vi, expect } from "vitest";
import { vol } from "memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");
vi.mock("@unlomtrois/steampath", async () => {
	return {
		locateSteamDir: async () => "C:\\Program Files (x86)\\Steam",
	};
});

beforeAll(() => {
	vol.reset();
});

const MOCK_LIBRARY_FOLDERS = `
"libraryfolders"
{
	"0"
	{
		"path"		"C:\\\\Program Files (x86)\\\\Steam"
		"label"		"SSD"
		"contentid"		"5977801890234434734"
		"totalsize"		"0"
		"update_clean_bytes_tally"		"177874938"
		"time_last_update_verified"		"1729612433"
		"apps"
		{
			"40"		"48239254"
		}
	}
	"1"
	{
		"path"		"E:\\\\SteamLibrary"
		"label"		"SSD2"
		"contentid"		"6422563497070285475"
		"totalsize"		"500093153280"
		"update_clean_bytes_tally"		"2149514569"
		"time_last_update_verified"		"1730130962"
		"apps"
		{
			"4000"		"4394213372"
		}
	}
}
`;

const MOCK_LIBRARY_FOLDERS_NO_GMOD = `
"libraryfolders"
{
	"0"
	{
		"path"		"C:\\\\Program Files (x86)\\\\Steam"
		"label"		"SSD"
		"contentid"		"5977801890234434734"
		"totalsize"		"0"
		"update_clean_bytes_tally"		"177874938"
		"time_last_update_verified"		"1729612433"
		"apps"
		{
			"40"		"48239254"
		}
	}
	"1"
	{
		"path"		"E:\\\\SteamLibrary"
		"label"		"SSD2"
		"contentid"		"6422563497070285475"
		"totalsize"		"500093153280"
		"update_clean_bytes_tally"		"2149514569"
		"time_last_update_verified"		"1730130962"
		"apps"
		{
			"50"		"4394213372"
		}
	}
}
`;

describe("findGModDirectory", () => {
	it("should properly find the Garry's Mod directory", async () => {
		vol.fromJSON({
			"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
				MOCK_LIBRARY_FOLDERS,
			"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\example.txt":
				"test",
		});

		const result = await findGModDirectory();

		expect(result).toBe("E:\\SteamLibrary\\steamapps\\common\\GarrysMod");
	});

	it("should return null if Garry's Mod is not installed", () => {
		vol.fromJSON({
			"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
				MOCK_LIBRARY_FOLDERS_NO_GMOD,
		});

		return expect(findGModDirectory()).resolves.toBe(null);
	});
});
