import getLatestGithubRelease from "../get-latest-github-release";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Mock taken from a real GitHub API response, shortened for brevity
const MOCK_GITHUB_API_RESPONSE = {
	url: "https://api.github.com/repos/gelly-gmod/gelly/releases/182096676",
	tag_name: "1.28.0",
	name: "1.28.0",
	assets: [
		{
			name: "gelly-gmod-release-x64.zip",
			browser_download_url:
				"https://github.com/gelly-gmod/gelly/releases/download/1.28.0/gelly-gmod-release-x64.zip",
		},
		{
			name: "gelly-gmod-relwithdebinfo-x64.zip",
			browser_download_url:
				"https://github.com/gelly-gmod/gelly/releases/download/1.28.0/gelly-gmod-relwithdebinfo-x64.zip",
		},
	],
	body: '### Added\r\n\r\n- Spray! You can now enjoy seeing light and foamy particles spray out of turbulent fluids.\r\n- Foam! You can now see your particles begin to scatter light and foam up when they\'re turbulent.\r\n- Bubbles... technically! You can now see white particles in the fluid when it\'s turbulent, which is a placeholder for\r\n  bubbles.\r\n- A new checkbox in the Simulation tab, "Whitewater Enabled," which enables the new spray and foam effects. You may\r\n  disable this to completely disable the new effects and thus save on performance.\r\n- A new per-preset checkbox, "Use Whitewater," which allows you to enable or disable whitewater on a per-preset basis,\r\n  such that the effects aren\'t illogically enabled, such as Glunk or Blood.\r\n\r\n### Changed\r\n\r\n- Improved how thickness is calculated, which means thin presets like Blood should still look mostly uniform across\r\n  their surface.\r\n\r\n### Fixed\r\n\r\n- Fixed a long-standing but particularly rare bug where fluid behind the camera, but not necessarily "out-of-frame"\r\n  would appear as\r\n  a silhouette in the thickness buffer.\r\n\r\n### Removed\r\n\r\n- Removed the old foam system, which was a bit of a mess and didn\'t look very good.',
};

const restHandlers = [
	http.get(
		"https://api.github.com/repos/gelly-gmod/gelly/releases/latest",
		() => {
			return HttpResponse.json(MOCK_GITHUB_API_RESPONSE);
		},
	),
];

const errorRestHandlers = [
	http.get(
		"https://api.github.com/repos/gelly-gmod/gelly/releases/latest",
		() => {
			return HttpResponse.error();
		},
	),
];

const mockServer = setupServer(...restHandlers);

beforeAll(() => {
	mockServer.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
	mockServer.close();
});

beforeEach(() => {
	mockServer.resetHandlers();
});

describe("getLatestGithubRelease", () => {
	it("should return a parsed GitHub release", async () => {
		const result = await getLatestGithubRelease();

		expect(result).toEqual({
			version: MOCK_GITHUB_API_RESPONSE.tag_name,
			releaseZipUrl:
				MOCK_GITHUB_API_RESPONSE.assets[0].browser_download_url,
			changelog: MOCK_GITHUB_API_RESPONSE.body,
		});
	});

	it("should throw an error if the GitHub API returns an error", async () => {
		mockServer.use(...errorRestHandlers);

		await expect(getLatestGithubRelease()).rejects.toThrowError();
	});
});
