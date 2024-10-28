import uninstallRelease from "../uninstall";
import { expect, describe, it, vi, beforeEach } from "vitest";
import { vol } from "memfs";
import getLatestGithubRelease from "../helpers/get-latest-github-release";

vi.mock("node:fs");
vi.mock("node:fs/promises");

vi.mock("node:process", async () => {
	return { cwd: () => "C:\\tmp" };
});

beforeEach(() => {
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

describe("uninstallRelease", () => {
	it("should properly uninstall any currently installed release in the GMod folder", async () => {
		vol.fromJSON(
			{
				"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
					MOCK_LIBRARY_FOLDERS,
				// Minimal GMod directory with a fake Gelly addon and binary
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\gelly\\lua.gitkeep":
					"Definitely a real addon",
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\gmcl_gelly-gmod_win64.dll":
					"Definitely a real binary",
				"C:\\tmp\\.gitkeep": "",
			},
			"C:\\tmp",
		);

		await uninstallRelease();

		expect(
			vol.existsSync(
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\gelly",
			),
		).toBe(false);
		expect(
			vol.existsSync(
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\gmcl_gelly-gmod_win64.dll",
			),
		).toBe(false);
	}, 2500);
});
