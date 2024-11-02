import ActionDialog from "../ActionDialog";

export default function UninstallActionDialog({
	currentVersion,
	isOpen,
	setIsOpen,
}: {
	currentVersion: string | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const onPrimary = async () => {
		return window.GellyBridge.uninstall();
	};

	return (
		<ActionDialog
			onPrimary={onPrimary}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			title={`Uninstall Gelly ${currentVersion}?`}
			description={`Are you sure you want to uninstall Gelly ${currentVersion}?`}
			primaryButtonText={"Uninstall"}
			completedTitle={`Gelly ${currentVersion} has been uninstalled!`}
			completedText={`Gelly ${currentVersion} has been successfully uninstalled!`}
		/>
	);
}
