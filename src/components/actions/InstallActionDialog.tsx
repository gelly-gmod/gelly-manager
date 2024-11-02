import ActionDialog from "../ActionDialog";

export default function InstallActionDialog({
	latestRelease,
	isOpen,
	setIsOpen,
}: {
	latestRelease: object | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const onPrimary = async () => {
		return window.GellyBridge.install(latestRelease);
	};

	return (
		<ActionDialog
			onPrimary={onPrimary}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			title={`Install Gelly ${latestRelease?.version}?`}
			description={`Are you sure you want to install Gelly ${latestRelease?.version}?`}
			primaryButtonText={"Install"}
			completedTitle={`Gelly ${latestRelease?.version} has been installed!`}
			completedText={`Gelly ${latestRelease?.version} has been successfully installed!`}
		/>
	);
}
