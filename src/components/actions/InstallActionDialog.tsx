import ActionDialog, {
	ActionDialogButton,
	ActionDialogButtons,
	ActionDialogDescription,
	ActionDialogTitle,
	ActionPhase,
} from "../ActionDialog";
import { useState } from "react";

export default function InstallActionDialog({
	latestRelease,
	isOpen,
	setIsOpen,
}: {
	latestRelease: object | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const [phase, setPhase] = useState<ActionPhase>(ActionPhase.Waiting);

	const busyIndicator = () => <div id="spinner" />;
	const completedIndicator = () => (
		<>
			<ActionDialogTitle>
				Gelly {latestRelease?.version} has been successfully installed!
			</ActionDialogTitle>
		</>
	);

	const onPrimary = async () => {
		return window.GellyBridge.install(latestRelease);
	};

	return (
		<ActionDialog
			BusyIndicator={busyIndicator}
			CompletedIndicator={completedIndicator}
			onPrimary={onPrimary}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			phase={phase}
			setPhase={setPhase}
		>
			<>
				<ActionDialogTitle>
					Install Gelly {latestRelease?.version}?
				</ActionDialogTitle>

				<ActionDialogDescription>
					Are you sure you want to install Gelly{" "}
					{latestRelease?.version}? Once started, you will not be able
					to cancel the installation.
				</ActionDialogDescription>

				<ActionDialogButtons>
					<ActionDialogButton
						primary
						onClick={() => setPhase(ActionPhase.Performing)}
					>
						Install
					</ActionDialogButton>

					<ActionDialogButton onClick={() => setIsOpen(false)}>
						Cancel
					</ActionDialogButton>
				</ActionDialogButtons>
			</>
		</ActionDialog>
	);
}
