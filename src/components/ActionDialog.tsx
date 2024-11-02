import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import Modal from "./Modal";

export enum ActionPhase {
	Waiting,
	Performing,
	Completed,
	Error,
}

const ActionBusyIndicator = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 20%;
	padding: 24px;
`;

const primaryButtonStyle = css`
	background: green;
	color: white;

	&:hover {
		background: darkgreen;
		transform: scale(1.03);
	}
`;

const dangerousPrimaryButtonStyle = css`
	background: red;
	color: white;
`;

const basicButtonStyle = css`
	background: none;
	border: 1px solid red;
	color: red;
`;

export const ActionDialogButton = styled.button<{
	primary?: boolean;
	dangerousPrimary?: boolean;
}>`
	appearance: none;
	outline: none;
	border: none;

	padding: 8px;

	cursor: pointer;
	transform: scale(1);
	transition:
		transform 0.1s ease,
		background-color 0.1s ease;

	${(props) => props.primary && primaryButtonStyle}
	${(props) => props.dangerousPrimary && dangerousPrimaryButtonStyle}
	${(props) => !props.primary && !props.dangerousPrimary && basicButtonStyle}
`;

export const ActionDialogTitle = styled.h1`
	font-size: 2.3rem;
`;

export const ActionDialogDescription = styled.p`
	font-size: 1rem;
`;

export const ActionDialogButtons = styled.section`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;

	width: 100%;
`;

export default function ActionDialog({
	onPrimary,
	isOpen,
	setIsOpen,
	title,
	description,
	primaryButtonText,
	completedTitle,
	completedText,
}: {
	onPrimary: () => Promise<unknown>;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	title: string;
	description: string;
	primaryButtonText: string;
	completedTitle: string;
	completedText: string;
}) {
	const [phase, setPhase] = useState<ActionPhase>(ActionPhase.Waiting);

	if (!isOpen) {
		return null;
	}

	if (phase === ActionPhase.Completed) {
		return (
			<Modal isOpen={isOpen}>
				<ActionDialogTitle>{completedTitle}</ActionDialogTitle>
				<ActionDialogDescription>
					{completedText}
				</ActionDialogDescription>

				<ActionDialogButtons>
					<ActionDialogButton
						primary
						onClick={() => {
							setIsOpen(false);
							setPhase(ActionPhase.Waiting);
						}}
					>
						Close
					</ActionDialogButton>
				</ActionDialogButtons>
			</Modal>
		);
	}

	if (phase === ActionPhase.Error) {
		return (
			<Modal isOpen={isOpen}>
				<ActionDialogTitle>
					An error occurred while performing the action.
				</ActionDialogTitle>
				<ActionDialogButtons>
					<ActionDialogButton
						primary
						onClick={() => setIsOpen(false)}
					>
						Close
					</ActionDialogButton>
				</ActionDialogButtons>
			</Modal>
		);
	}

	if (phase === ActionPhase.Performing) {
		return (
			<Modal isOpen={isOpen}>
				<ActionBusyIndicator>
					<div id="spinner" />
				</ActionBusyIndicator>
			</Modal>
		);
	}

	if (phase === ActionPhase.Waiting) {
		return (
			<Modal isOpen={isOpen}>
				<ActionDialogTitle>{title}</ActionDialogTitle>
				<ActionDialogDescription>{description}</ActionDialogDescription>

				<ActionDialogButtons>
					<ActionDialogButton
						primary
						onClick={() => {
							setPhase(ActionPhase.Performing);
							onPrimary()
								.then(() => setPhase(ActionPhase.Completed))
								.catch(() => setPhase(ActionPhase.Error));
						}}
					>
						{primaryButtonText}
					</ActionDialogButton>
					<ActionDialogButton onClick={() => setIsOpen(false)}>
						Cancel
					</ActionDialogButton>
				</ActionDialogButtons>
			</Modal>
		);
	}

	return null;
}
