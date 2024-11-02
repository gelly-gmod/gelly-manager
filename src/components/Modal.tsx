import "./Modal.css";
import { useEffect } from "react";

export default function Modal({
	children,
	isOpen,
}: {
	children: React.ReactNode;
	isOpen: boolean;
}) {
	useEffect(() => {
		if (isOpen) {
			window.GellyBridge.updateTitleBarButtonsOnModalOpen();
		} else {
			window.GellyBridge.updateTitleBarButtonsOnModalClose();
		}
	}, [isOpen]);

	return (
		isOpen && (
			<>
				<div id="modal-backdrop" />
				<div id="modal">{children}</div>
			</>
		)
	);
}
