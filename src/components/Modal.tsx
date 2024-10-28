import { VNode } from "preact";

import "./Modal.css";
import { useEffect } from "preact/compat";

export default function Modal({
	children,
	isOpen,
}: {
	children: VNode | VNode[];
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
