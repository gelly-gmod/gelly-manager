import ActionDialog from "../ActionDialog";

export default function CorruptedActionDialog({
	latestRelease,
	isOpen,
	setIsOpen,
}: {
	latestRelease: object | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const onPrimary = async () => {
		return Promise.all([
			window.GellyBridge.uninstall(),
			window.GellyBridge.install(latestRelease),
		]);
	};

	return (
		<ActionDialog
			onPrimary={onPrimary}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			title={"Your Gelly installation is corrupted."}
			description={`Your Gelly installation is corrupted. Would you like to uninstall and reinstall Gelly ${latestRelease?.version}?`}
			primaryButtonText={"Repair"}
			completedTitle={"Gelly has been repaired!"}
			completedText={`Gelly ${latestRelease?.version} has been successfully reinstalled!`}
		/>
	);
}
