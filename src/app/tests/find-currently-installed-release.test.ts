import findCurrentlyInstalledRelease from "../find-currently-installed-release";
import { vol } from "memfs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "path";

vi.mock("node:fs");
vi.mock("node:fs/promises");

// Fixed binary at version 1.27.0
const MOCK_GELLY_BINARY = path.join(
	process.cwd(),
	"__fixtures__",
	"gmcl_gelly-gmod_win64.dll",
);

// why we're mocking win-version-info:
// - win-version-info is a native module
// - therefore it wont follow the vi.mock("node:fs") mock
// - so we'll have to mock it manually to make sure it uses
//   the test fixture.
// - it is impossible for it to use the memfs volume, but
//   we add the binary anyways in the memfs volume for completeness
vi.mock("win-version-info", async (importOriginal) => {
	const realVersionInfo = await importOriginal<{
		default: typeof import("win-version-info");
	}>();

	return {
		default: () => {
			return realVersionInfo.default(MOCK_GELLY_BINARY);
		},
	};
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

beforeEach(() => {
	vol.reset();
});

describe("findCurrentlyInstalledRelease", () => {
	it("should properly return the currently installed release version", async () => {
		// We have to make sure we're using the actual fs module here
		const fs =
			await vi.importActual<typeof import("node:fs/promises")>(
				"node:fs/promises",
			);

		const binaryFixtureBuffer = await fs.readFile(MOCK_GELLY_BINARY);

		vol.fromJSON(
			{
				"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
					MOCK_LIBRARY_FOLDERS,
				// Minimal GMod directory with a fake Gelly addon and binary
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\gelly\\lua\\.gitkeep":
					"Definitely a real addon",
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\gmcl_gelly-gmod_win64.dll":
					binaryFixtureBuffer,
			},
			"C:\\tmp",
		);

		const release = await findCurrentlyInstalledRelease();

		expect(release).not.toEqual(null);
		expect(release.version).toEqual("1.27.0");
	});

	it("should detect installs with the lua+gma regression", async () => {
		const fs =
			await vi.importActual<typeof import("node:fs/promises")>(
				"node:fs/promises",
			);

		const binaryFixtureBuffer = await fs.readFile(MOCK_GELLY_BINARY);

		vol.fromJSON(
			{
				"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
					MOCK_LIBRARY_FOLDERS,
				// Minimal GMod directory with a fake Gelly addon and binary
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\gelly\\gelly.gma":
					"Definitely a real addon",
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\gelly\\lua\\.gitkeep":
					"",
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\gmcl_gelly-gmod_win64.dll":
					binaryFixtureBuffer,
			},
			"C:\\tmp",
		);

		const release = await findCurrentlyInstalledRelease();

		expect(release).not.toEqual(null);
		expect(release.hasBothGMAAndLua).toEqual(true);
	});

	it("should return null if there is an incomplete installation", async () => {
		// we'll test by including the binary but not the addon
		const fs =
			await vi.importActual<typeof import("node:fs/promises")>(
				"node:fs/promises",
			);

		const binaryFixtureBuffer = await fs.readFile(MOCK_GELLY_BINARY);

		vol.fromJSON(
			{
				"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
					MOCK_LIBRARY_FOLDERS,
				// Minimal GMod directory with a fake Gelly binary
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\gmcl_gelly-gmod_win64.dll":
					binaryFixtureBuffer,
			},
			"C:\\tmp",
		);

		const release = await findCurrentlyInstalledRelease();

		expect(release).toEqual(null);
	});

	it("should return null if there is no installation", async () => {
		vol.fromJSON(
			{
				"C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf":
					MOCK_LIBRARY_FOLDERS,
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\.gitkeep":
					"",
				"E:\\SteamLibrary\\steamapps\\common\\GarrysMod\\garrysmod\\lua\\bin\\.gitkeep":
					"",
			},
			"C:\\tmp",
		);

		const release = await findCurrentlyInstalledRelease();

		expect(release).toEqual(null);
	});
});
