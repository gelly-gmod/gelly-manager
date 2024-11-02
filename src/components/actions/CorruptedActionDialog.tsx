import ActionDialog, {
	ActionDialogButton,
	ActionDialogButtons,
	ActionDialogDescription,
	ActionDialogTitle,
	ActionPhase,
} from "../ActionDialog";
import { useState } from "react";

export default function CorruptedActionDialog({
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
		return Promise.all([
			window.GellyBridge.uninstall(),
			window.GellyBridge.install(latestRelease),
		]);
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
					You have a corrupted installation of Gelly.
				</ActionDialogTitle>

				<ActionDialogDescription>
					The current installation of Gelly is corrupted. Would you
					like to install Gelly{" "}
					{latestRelease ? latestRelease.version : "..."}? This will
					repair the corrupted installation.
				</ActionDialogDescription>

				<ActionDialogButtons>
					<ActionDialogButton
						primary
						onClick={() => setPhase(ActionPhase.Performing)}
					>
						Repair
					</ActionDialogButton>

					<ActionDialogButton onClick={() => setIsOpen(false)}>
						Cancel
					</ActionDialogButton>
				</ActionDialogButtons>
			</>
		</ActionDialog>
	);
}
