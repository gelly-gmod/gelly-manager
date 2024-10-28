import { GithubRelease } from "./helpers/get-latest-github-release";
import downloadReleaseAsZip from "./helpers/download-release-as-zip";
import findGModDirectory from "./helpers/find-gmod-directory";
import JSZip from "jszip";
import * as process from "node:process";
import * as fs from "node:fs";

const ZIP_ROOT = "gelly-gmod-release-x64/garrysmod";

export default async function installRelease(
	release: GithubRelease,
): Promise<void> {
	const cwd = process.cwd();
	const pathToRelease = await downloadReleaseAsZip(release, cwd);

	const gmodDir = (await findGModDirectory()) + "/garrysmod";
	const zip = await JSZip.loadAsync(fs.readFileSync(pathToRelease));
	for (const entry of Object.values(zip.files)) {
		const fileName: string = entry.name;
		if (entry.dir) {
			continue;
		}

		const zipRelativePath = fileName.split(ZIP_ROOT)[1];
		const fullPath = `${gmodDir}/${zipRelativePath}`;
		const fullParentPath = fullPath.split("/").slice(0, -1).join("/");
		if (!fs.existsSync(fullParentPath)) {
			fs.mkdirSync(fullParentPath, { recursive: true });
		}

		const fileBuffer = entry.nodeStream();
		const writeStream = fs.createWriteStream(fullPath);
		const promisifiedPipe = new Promise((resolve, reject) => {
			fileBuffer
				.pipe(writeStream)
				.on("finish", resolve)
				.on("error", reject);
		});

		await promisifiedPipe;
	}

	fs.unlinkSync(pathToRelease);
}
