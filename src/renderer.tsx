import "./index.css";
import { createRoot } from "react-dom/client";
import StartPage from "./pages/StartPage";

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = createRoot(rootElement);
	root.render(<StartPage />);
}
