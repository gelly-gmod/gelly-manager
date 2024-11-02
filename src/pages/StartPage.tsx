import { useEffect, useState } from "react";

import "./StartPage.css";
import gellyLogo from "../assets/gellylogo.svg";
import { marked } from "marked";

import InstallActionDialog from "../components/actions/InstallActionDialog";
import UninstallActionDialog from "../components/actions/UninstallActionDialog";
import CorruptedActionDialog from "../components/actions/CorruptedActionDialog";

export default function StartPage() {
	const [currentVersion, setCurrentVersion] = useState<string | null>(null);
	const [isCorrupted, setIsCorrupted] = useState<boolean>(false);
	const [latestRelease, setLatestRelease] = useState<object | null>(null);
	const [parsedMarkdown, setParsedMarkdown] = useState<string>("");
	const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
	const [uninstallModalOpen, setUninstallModalOpen] =
		useState<boolean>(false);

	const [fetchingLatestRelease, setFetchingLatestRelease] =
		useState<boolean>(true);

	useEffect(() => {
		window.GellyBridge.getCurrentRelease().then((release) => {
			if (release) {
				setCurrentVersion(release.version);
				setIsCorrupted(release.hasBothGMAAndLua);
			} else {
				setCurrentVersion(null);
				setIsCorrupted(false);
			}
		});

		if (!latestRelease) {
			setFetchingLatestRelease(true);
		}

		window.GellyBridge.getLatestRelease().then((release) => {
			setFetchingLatestRelease(false);
			setLatestRelease(release);
			setParsedMarkdown(marked(release.changelog, { async: false }));
		});
	}, [installModalOpen, uninstallModalOpen]);

	return (
		<>
			<InstallActionDialog
				latestRelease={latestRelease}
				isOpen={installModalOpen}
				setIsOpen={setInstallModalOpen}
			/>

			<UninstallActionDialog
				currentVersion={currentVersion}
				isOpen={uninstallModalOpen}
				setIsOpen={setUninstallModalOpen}
			/>

			<CorruptedActionDialog
				latestRelease={latestRelease}
				isOpen={isCorrupted}
				setIsOpen={setIsCorrupted}
			/>

			<main>
				<header>
					<img src={gellyLogo} alt="Gelly Logo" id="gelly-logo" />
				</header>

				<section id="changelog">
					{fetchingLatestRelease && <div id="spinner" />}
					<div dangerouslySetInnerHTML={{ __html: parsedMarkdown }} />
				</section>

				<footer>
					<div id="spacer" />
					{latestRelease &&
					latestRelease.version === currentVersion ? (
						<button
							id="install-button"
							onClick={() => window.GellyBridge.runGMod()}
						>
							<i className="bi bi-play-fill"></i> Launch
						</button>
					) : (
						<button
							id="install-button"
							onClick={() => setInstallModalOpen(true)}
						>
							<i className="bi bi-download"></i> Install{" "}
							{latestRelease ? latestRelease.version : "..."}
						</button>
					)}
					<div id="spacer" />
					<section id="version-info">
						<span>
							{currentVersion
								? `Using Gelly ${currentVersion}`
								: "Gelly is not installed"}
						</span>
						<button
							id="uninstall-button"
							disabled={!currentVersion}
							onClick={() => setUninstallModalOpen(true)}
						>
							Uninstall
						</button>
					</section>
				</footer>
			</main>
		</>
	);
}
