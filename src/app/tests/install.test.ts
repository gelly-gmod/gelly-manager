import installRelease from "../install";
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

describe("installRelease", () => {
	it("should properly install a github release and delete temporary files once complete", async () => {
		vol.fromJSON(
			{
				"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
					MOCK_LIBRARY_FOLDERS,
				// Minimal GMod directory
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\.gitkeep":
					"",
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\.gitkeep":
					"",
				"C:\\tmp\\.gitkeep": "",
			},
			"C:\\tmp",
		);

		const latestRelease = await getLatestGithubRelease();
		await installRelease(latestRelease);

		expect(
			vol.existsSync(
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\gelly",
			),
		).toBe(true);
		expect(
			vol.existsSync(
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\gmcl_gelly-gmod_win64.dll",
			),
		).toBe(true);

		// ensure that the unit removed the release zip
		expect(vol.existsSync("C:\\tmp\\gelly-gmod-release-x64.zip")).toBe(
			false,
		);
	}, 7500);
});
