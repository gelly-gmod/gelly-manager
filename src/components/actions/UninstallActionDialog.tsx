import ActionDialog, {
	ActionDialogButton,
	ActionDialogButtons,
	ActionDialogDescription,
	ActionDialogTitle,
	ActionPhase,
} from "../ActionDialog";
import { useState } from "react";

export default function UninstallActionDialog({
	currentVersion,
	isOpen,
	setIsOpen,
}: {
	currentVersion: string | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const [phase, setPhase] = useState<ActionPhase>(ActionPhase.Waiting);

	const busyIndicator = () => <div id="spinner" />;
	const completedIndicator = () => (
		<>
			<ActionDialogTitle>
				Gelly {currentVersion} has been successfully uninstalled!
			</ActionDialogTitle>
		</>
	);

	const onPrimary = async () => {
		return window.GellyBridge.uninstall();
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
					Uninstall Gelly {currentVersion}?
				</ActionDialogTitle>

				<ActionDialogDescription>
					Are you sure you want to uninstall Gelly {currentVersion}?
					Once started, you will not be able to cancel the
					uninstallation.
				</ActionDialogDescription>

				<ActionDialogButtons>
					<ActionDialogButton
						dangerousPrimary
						onClick={() => setPhase(ActionPhase.Performing)}
					>
						Uninstall
					</ActionDialogButton>

					<ActionDialogButton onClick={() => setIsOpen(false)}>
						Cancel
					</ActionDialogButton>
				</ActionDialogButtons>
			</>
		</ActionDialog>
	);
}
