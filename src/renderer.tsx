import "./index.css";
import { render } from "preact";
import StartPage from "./pages/StartPage";

const rootElement = document.getElementById("root");

if (rootElement) {
	render(<StartPage />, rootElement);
}
