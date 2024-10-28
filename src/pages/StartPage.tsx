import { useEffect, useState } from "preact/compat";

import "./StartPage.css";
import gellyLogo from "../assets/gellylogo.svg";
import { marked } from "marked";
import Modal from "../components/Modal";

function InstallModal({
	latestRelease,
	isOpen,
	setIsOpen,
}: {
	latestRelease: object | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const [installing, setInstalling] = useState<boolean>(false);
	const [installed, setInstalled] = useState<boolean>(false);
	const [errorOccurred, setErrorOccurred] = useState<boolean>(false);

	useEffect(() => {
		if (installing) {
			window.GellyBridge.install(latestRelease).then((success) => {
				if (success) {
					setInstalled(true);
					setInstalling(true);
				} else {
					setErrorOccurred(true);
					setInstalled(false);
					setInstalling(false);
				}
			});
		}
	}, [installing]);

	return !installing ? (
		<Modal isOpen={isOpen}>
			<h1>Install Gelly?</h1>
			<p>
				Are you sure you want to install Gelly{" "}
				{latestRelease ? latestRelease.version : "..."}? Once
				installation begins, you will not be able to cancel it.
			</p>
			<section id="install-modal-buttons">
				<button id="install" onClick={() => setInstalling(true)}>
					Install
				</button>
				<button id="cancel" onClick={() => setIsOpen(false)}>
					Cancel
				</button>
			</section>
		</Modal>
	) : (
		<Modal isOpen={isOpen}>
			<h1>
				Installing Gelly {latestRelease ? latestRelease.version : "..."}
			</h1>
			{installed ? (
				<>
					<p>Gelly has been successfully installed!</p>

					<button
						id="close-modal-button"
						onClick={() => {
							setIsOpen(false);
							setInstalling(false);
							setInstalled(false);
						}}
					>
						Close
					</button>
				</>
			) : (
				<div id="spinner-container">
					<div id="spinner" />
				</div>
			)}
		</Modal>
	);
}

function UninstallModal({
	currentVersion,
	isOpen,
	setIsOpen,
}: {
	currentVersion: string | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const [uninstalling, setUninstalling] = useState<boolean>(false);
	const [uninstalled, setUninstalled] = useState<boolean>(false);
	const [errorOccurred, setErrorOccurred] = useState<boolean>(false);

	useEffect(() => {
		if (uninstalling) {
			window.GellyBridge.uninstall().then((success) => {
				if (success) {
					setUninstalled(true);
					setUninstalling(true);
				} else {
					setErrorOccurred(true);
					setUninstalled(false);
					setUninstalling(false);
				}
			});
		}
	}, [uninstalling]);

	return !uninstalling ? (
		<Modal isOpen={isOpen}>
			<h1>Uninstall Gelly?</h1>
			<p>
				Are you sure you want to uninstall Gelly{" "}
				{currentVersion ? currentVersion : "..."}? Once uninstallation
				begins, you will not be able to cancel it.
			</p>
			<section id="install-modal-buttons">
				<button id="uninstall" onClick={() => setUninstalling(true)}>
					Uninstall
				</button>
				<button id="cancel" onClick={() => setIsOpen(false)}>
					Cancel
				</button>
			</section>
		</Modal>
	) : (
		<Modal isOpen={isOpen}>
			<h1>
				Uninstalling Gelly {currentVersion ? currentVersion : "..."}
			</h1>
			{uninstalled ? (
				<>
					<p>Gelly has been successfully uninstalled!</p>

					<button
						id="close-modal-button"
						onClick={() => {
							setIsOpen(false);
							setUninstalling(false);
							setUninstalled(false);
						}}
					>
						Close
					</button>
				</>
			) : (
				<div id="spinner-container">
					<div id="spinner" />
				</div>
			)}
		</Modal>
	);
}

function CorruptedModal({
	latestRelease,
	isOpen,
	setIsOpen,
}: {
	latestRelease: object | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const [installing, setInstalling] = useState<boolean>(false);
	const [installed, setInstalled] = useState<boolean>(false);
	const [errorOccurred, setErrorOccurred] = useState<boolean>(false);

	useEffect(() => {
		if (installing) {
			window.GellyBridge.uninstall().then((success) => {
				if (!success) {
					setErrorOccurred(true);
					setInstalled(false);
					setInstalling(false);
					return;
				}

				window.GellyBridge.install(latestRelease).then((success) => {
					if (success) {
						setInstalled(true);
						setInstalling(true);
					} else {
						setErrorOccurred(true);
						setInstalled(false);
						setInstalling(false);
					}
				});
			});
		}
	}, [installing]);

	return !installing ? (
		<Modal isOpen={isOpen}>
			<h1>Your current Gelly installation is corrupted.</h1>
			<p>
				Corruption was detected in your current Gelly installation.
				Would you like to repair the installation and install Gelly{" "}
				{latestRelease ? latestRelease.version : "..."}?
			</p>
			<section id="install-modal-buttons">
				<button id="install" onClick={() => setInstalling(true)}>
					Repair
				</button>
				<button id="cancel" onClick={() => setIsOpen(false)}>
					Cancel
				</button>
			</section>
		</Modal>
	) : (
		<Modal isOpen={isOpen}>
			<h1>
				Installing Gelly {latestRelease ? latestRelease.version : "..."}
			</h1>
			{installed ? (
				<>
					<p>Gelly has been successfully repaired!</p>

					<button
						id="close-modal-button"
						onClick={() => {
							setIsOpen(false);
							setInstalling(false);
							setInstalled(false);
						}}
					>
						Close
					</button>
				</>
			) : (
				<div id="spinner-container">
					<div id="spinner" />
				</div>
			)}
		</Modal>
	);
}

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
			<InstallModal
				latestRelease={latestRelease}
				isOpen={installModalOpen}
				setIsOpen={setInstallModalOpen}
			/>

			<UninstallModal
				currentVersion={currentVersion}
				isOpen={uninstallModalOpen}
				setIsOpen={setUninstallModalOpen}
			/>

			<CorruptedModal
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
							<i class="bi bi-play-fill"></i> Launch
						</button>
					) : (
						<button
							id="install-button"
							onClick={() => setInstallModalOpen(true)}
						>
							<i class="bi bi-download"></i> Install{" "}
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
