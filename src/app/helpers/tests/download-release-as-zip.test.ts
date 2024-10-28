import downloadReleaseAsZip from "../download-release-as-zip";
import {
	vi,
	describe,
	it,
	expect,
	beforeEach,
	beforeAll,
	afterAll,
} from "vitest";
import { vol } from "memfs";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("node:fs");
vi.mock("node:fs/promises");

const EXAMPLE_ZIP_FILE = `
I am definitely a zip file!
`;

const EXAMPLE_ZIP_URL =
	"https://example.githubusercontent.com/gelly-gmod/gelly/releases/download/1.28.0/gelly-gmod-release-x64.zip";

const restHandlers = [
	http.get(EXAMPLE_ZIP_URL, () => {
		return new Response(EXAMPLE_ZIP_FILE, {
			status: 200,
			headers: {
				"Content-Type": "application/zip",
				"Content-Length": EXAMPLE_ZIP_FILE.length.toString(),
			},
		});
	}),
];

const errorRestHandlers = [
	http.get(EXAMPLE_ZIP_URL, () => {
		return HttpResponse.error();
	}),
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
	vol.reset();
});

describe("downloadReleaseAsZip", () => {
	it("should save the release as a zip to the specified path when an internet connection is available", async () => {
		vol.fromJSON({
			"/path/to/zip/.gitkeep": "",
		});

		await downloadReleaseAsZip(
			{
				version: "1.28.0",
				releaseZipUrl: EXAMPLE_ZIP_URL,
				changelog: "This is a test changelog.",
			},
			"/path/to/zip",
		);

		const files = vol.readdirSync("/path/to/zip");
		expect(files).toContain("gelly-gmod-release-x64.zip");

		const fileContents = vol.readFileSync(
			"/path/to/zip/gelly-gmod-release-x64.zip",
			"utf8",
		);
		expect(fileContents).toBe(EXAMPLE_ZIP_FILE);
	});

	it("should throw an error when the download fails", async () => {
		mockServer.use(...errorRestHandlers);

		expect(
			downloadReleaseAsZip(
				{
					version: "1.28.0",
					releaseZipUrl: EXAMPLE_ZIP_URL,
					changelog: "This is a test changelog.",
				},
				"/path/to/zip",
			),
		).rejects.toThrow();
	});
});
