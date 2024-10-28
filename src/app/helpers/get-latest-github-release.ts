export type GithubRelease = {
	version: string;
	releaseZipUrl: string;
	changelog: string;
};

export type RawGithubAPIResponse = {
	tag_name: string;
	// CI/CD pipeline populates this with the changelog
	body: string;
	assets: {
		name: string;
		browser_download_url: string;
	}[];
};

const GITHUB_API_URL =
	"https://api.github.com/repos/gelly-gmod/gelly/releases/latest";

export default async function getLatestGithubRelease(): Promise<GithubRelease> {
	const response = await fetch(GITHUB_API_URL);
	if (response.status !== 200) {
		throw new Error(
			`Failed to fetch latest release from GitHub: ${response.statusText}`,
		);
	}

	const json: RawGithubAPIResponse = await response.json();

	return {
		version: json.tag_name,
		releaseZipUrl: json.assets[0].browser_download_url,
		changelog: json.body,
	};
}
