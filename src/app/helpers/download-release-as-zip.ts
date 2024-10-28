import { GithubRelease } from "./get-latest-github-release";
import * as fs from "node:fs";

export default async function downloadReleaseAsZip(
	release: GithubRelease,
	path: string,
): Promise<string> {
	const releaseURL = new URL(release.releaseZipUrl);
	const fileName = releaseURL.pathname.split("/").pop() as string;

	const response = await fetch(release.releaseZipUrl);
	const buffer = await response.arrayBuffer();

	await fs.promises.writeFile(`${path}/${fileName}`, Buffer.from(buffer));

	return `${path}/${fileName}`;
}
