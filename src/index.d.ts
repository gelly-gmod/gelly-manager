import { GellyBridge } from "./preload";

declare global {
	interface Window {
		GellyBridge: typeof GellyBridge;
	}
}
