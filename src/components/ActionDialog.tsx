import { ComponentChildren, FunctionalComponent, VNode } from "preact";

enum ActionPhase {
	Waiting,
	Performing,
	Completed,
	Error,
}

export function ActionBusyIndicator({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div class="action-busy-indicator">{children}</div>;
}
